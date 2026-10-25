const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  BlueprintSchema,
  BlueprintRevisionMetadataSchema,
  ComponentSchema
} = require('../src/index');

describe('BlueprintSchema Contract Validation', () => {

  const validBlueprint = {
    projectId: 'proj_storefront_prod',
    version: 1,
    name: 'Production Storefront',
    requirements: {
      availability: 'survive_server_failure',
      expectedUsers: 'moderate',
      budget: 'low',
      security: 'strict'
    },
    components: [
      {
        id: 'web',
        kind: 'static_frontend',
        label: 'Web Storefront',
        zone: 'public',
        config: {
          runtime: 'static',
          buildCommand: 'npm run build',
          outputDir: 'dist',
          envVars: ['VITE_API_URL']
        },
        reason: 'Public static frontend built with React'
      },
      {
        id: 'api',
        kind: 'api_service',
        label: 'Backend API',
        zone: 'public', // internet-facing entrypoint for client traffic
        replicas: {
          min: 2,
          max: 4
        },
        config: {
          runtime: 'node20',
          port: 5000,
          healthPath: '/health',
          buildCommand: 'npm ci',
          startCommand: 'node server.js',
          envVars: ['PORT', 'NODE_ENV', 'DATABASE_URL']
        },
        reason: 'REST API service with redundancy'
      },
      {
        id: 'db',
        kind: 'postgres',
        label: 'Core Database',
        zone: 'private',
        config: {
          version: '15',
          backup: {
            enabled: true,
            retentionDays: 7
          }
        },
        reason: 'Private relational database with automated backups'
      }
    ],
    connections: [
      {
        id: 'conn_web_api',
        from: 'web',
        to: 'api',
        purpose: 'sends_requests',
        reason: 'Frontend calls public API endpoints'
      },
      {
        id: 'conn_api_db',
        from: 'api',
        to: 'db',
        purpose: 'reads_writes',
        reason: 'API queries private PostgreSQL database'
      }
    ]
  };

  it('successfully parses a canonical production blueprint', () => {
    const result = BlueprintSchema.safeParse(validBlueprint);
    assert.equal(result.success, true);
    assert.equal(result.data.components.length, 3);
    assert.equal(result.data.connections.length, 2);
    assert.equal(result.data.projectId, 'proj_storefront_prod');
  });

  it('rejects duplicate component IDs within components array', () => {
    const duplicateBlueprint = {
      ...validBlueprint,
      components: [
        ...validBlueprint.components,
        {
          id: 'api', // duplicate ID
          kind: 'background_worker',
          label: 'Duplicate Worker',
          zone: 'private',
          replicas: { min: 1, max: 1 },
          config: {
            runtime: 'node20',
            startCommand: 'node worker.js'
          }
        }
      ]
    };

    const result = BlueprintSchema.safeParse(duplicateBlueprint);
    assert.equal(result.success, false);
    const issue = result.error.issues.find(i => i.message.includes("Duplicate component ID 'api'"));
    assert.ok(issue, 'Expected duplicate ID error');
  });

  it('rejects inverted replica bounds (min > max)', () => {
    const badReplicas = {
      ...validBlueprint,
      components: [
        {
          id: 'api',
          kind: 'api_service',
          label: 'Backend API',
          zone: 'public',
          replicas: {
            min: 5,
            max: 2 // inverted!
          },
          config: {
            runtime: 'node20',
            port: 5000,
            healthPath: '/health',
            startCommand: 'node server.js'
          }
        }
      ]
    };

    const result = BlueprintSchema.safeParse(badReplicas);
    assert.equal(result.success, false);
    const issue = result.error.issues.find(i => i.message.includes('greater than or equal to replicas.min'));
    assert.ok(issue, 'Expected inverted replica error');
  });

  it('rejects illegal characters in component IDs', () => {
    const badId = {
      ...validBlueprint,
      components: [
        {
          id: 'API Service With Spaces!',
          kind: 'static_frontend',
          label: 'Frontend',
          zone: 'public',
          config: {
            runtime: 'static',
            buildCommand: 'npm run build',
            outputDir: 'dist'
          }
        }
      ]
    };

    const result = BlueprintSchema.safeParse(badId);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some(i => i.message.includes('Component ID must be')));
  });

  it('rejects missing consequential operational requirements (no silent defaults)', () => {
    const missingReqs = {
      ...validBlueprint,
      requirements: {} // empty!
    };

    const result = BlueprintSchema.safeParse(missingReqs);
    assert.equal(result.success, false);
    const requiredKeys = ['availability', 'budget', 'expectedUsers', 'security'];
    for (const key of requiredKeys) {
      assert.ok(result.error.issues.some(i => i.path.includes(key)), `Expected missing ${key} requirement error`);
    }
  });

  it('strictly rejects databases located in public zone', () => {
    const publicDb = {
      id: 'db',
      kind: 'postgres',
      label: 'Public DB (Security Violation)',
      zone: 'public', // illegal!
      config: {
        version: '15',
        backup: {
          enabled: true,
          retentionDays: 7
        }
      }
    };

    const result = ComponentSchema.safeParse(publicDb);
    assert.equal(result.success, false);
  });

  it('validates backend revision metadata envelope', () => {
    const revisionRecord = {
      id: 'rev_104928',
      projectId: 'proj_storefront_prod',
      version: 1,
      status: 'approved',
      definition: validBlueprint,
      approvedBy: 'usr_prembhuvan',
      createdAt: new Date().toISOString()
    };

    const result = BlueprintRevisionMetadataSchema.safeParse(revisionRecord);
    assert.equal(result.success, true);
    assert.equal(result.data.status, 'approved');
  });

  it('rejects duplicate connection IDs within connections array', () => {
    const duplicateConnBlueprint = {
      ...validBlueprint,
      connections: [
        ...validBlueprint.connections,
        {
          id: 'conn_web_api', // duplicate ID!
          from: 'web',
          to: 'api',
          purpose: 'sends_requests'
        }
      ]
    };

    const result = BlueprintSchema.safeParse(duplicateConnBlueprint);
    assert.equal(result.success, false);
    const issue = result.error.issues.find(i => i.message.includes("Duplicate connection ID 'conn_web_api'"));
    assert.ok(issue, 'Expected duplicate connection ID error');
  });

  it('rejects revision metadata when outer projectId mismatches definition.projectId', () => {
    const mismatchedRecord = {
      id: 'rev_104928',
      projectId: 'proj_OUTER_MISMATCH',
      version: 1,
      status: 'draft',
      definition: validBlueprint // definition has projectId: 'proj_storefront_prod'
    };

    const result = BlueprintRevisionMetadataSchema.safeParse(mismatchedRecord);
    assert.equal(result.success, false);
    const issue = result.error.issues.find(i => i.message.includes('does not match definition.projectId'));
    assert.ok(issue, 'Expected projectId consistency error');
  });

  it('rejects revision metadata when outer version mismatches definition.version', () => {
    const mismatchedRecord = {
      id: 'rev_104928',
      projectId: 'proj_storefront_prod',
      version: 99, // outer says 99, but definition.version is 1
      status: 'draft',
      definition: validBlueprint
    };

    const result = BlueprintRevisionMetadataSchema.safeParse(mismatchedRecord);
    assert.equal(result.success, false);
    const issue = result.error.issues.find(i => i.message.includes('does not match definition.version'));
    assert.ok(issue, 'Expected version consistency error');
  });

  it('intentionally delegates connection endpoint existence check to packages/graph', () => {
    // A connection whose 'to' target is not in components is structurally valid Zod syntax.
    // The schema does not duplicate graph validation (endpoint resolution / cycles).
    const blueprintWithDanglingEdge = {
      ...validBlueprint,
      connections: [
        ...validBlueprint.connections,
        {
          id: 'conn_dangling',
          from: 'api',
          to: 'non_existent_target',
          purpose: 'reads_writes',
          reason: 'Edge pointing to missing target (delegated to packages/graph)'
        }
      ]
    };

    const result = BlueprintSchema.safeParse(blueprintWithDanglingEdge);
    assert.equal(result.success, true, 'Schema should pass structural validation and delegate endpoint check to graph package');
  });

  describe('Shared Test Fixtures (JSON)', () => {
    const sampleFixturePath = path.join(__dirname, '../fixtures/sample_fixture.json');
    const brokenFixturePath = path.join(__dirname, '../fixtures/broken_fixture.json');

    it('loads and validates sample_fixture.json successfully', () => {
      const raw = fs.readFileSync(sampleFixturePath, 'utf8');
      const sampleFixture = JSON.parse(raw);
      const result = BlueprintSchema.safeParse(sampleFixture);

      assert.equal(result.success, true, 'sample_fixture.json must satisfy BlueprintSchema');
      assert.equal(result.data.projectId, 'proj_storefront_prod');
      assert.equal(result.data.components.length, 3);
      assert.equal(result.data.connections.length, 2);
    });

    it('loads broken_fixture.json and catches the deliberate duplicate component ID violation', () => {
      // Intended failure: broken_fixture.json contains two components with id 'api' (api_service and postgres),
      // violating component ID uniqueness in BlueprintSchema.superRefine.
      const raw = fs.readFileSync(brokenFixturePath, 'utf8');
      const brokenFixture = JSON.parse(raw);
      const result = BlueprintSchema.safeParse(brokenFixture);

      assert.equal(result.success, false, 'broken_fixture.json must be rejected by BlueprintSchema');
      
      const duplicateIssue = result.error.issues.find(
        (issue) => issue.message.includes("Duplicate component ID 'api'")
      );
      assert.ok(duplicateIssue, "Expected failure specifically caused by deliberate duplicate component ID 'api'");
      assert.deepEqual(duplicateIssue.path, ['components', 2, 'id']);
    });
  });

  describe('dependsOn Validation', () => {
    // Helper: minimal valid component without dependsOn (defaults to [])
    const baseComponents = [
      {
        id: 'web',
        kind: 'static_frontend',
        label: 'Web Storefront',
        zone: 'public',
        config: { runtime: 'static', buildCommand: 'npm run build', outputDir: 'dist' }
      },
      {
        id: 'api',
        kind: 'api_service',
        label: 'Backend API',
        zone: 'public',
        replicas: { min: 1, max: 2 },
        config: { runtime: 'node20', port: 5000, healthPath: '/health', startCommand: 'node server.js' }
      },
      {
        id: 'db',
        kind: 'postgres',
        label: 'Primary DB',
        zone: 'private',
        config: { version: '15', backup: { enabled: true, retentionDays: 7 } }
      }
    ];
    const baseBlueprint = {
      projectId: 'proj_test',
      version: 1,
      name: 'Test Blueprint',
      requirements: { availability: 'survive_server_failure', budget: 'low', expectedUsers: 'moderate', security: 'strict' },
      components: baseComponents,
      connections: []
    };

    it('accepts components with valid explicit dependsOn declarations', () => {
      const bp = {
        ...baseBlueprint,
        components: [
          baseComponents[0], // web — no dependsOn, defaults to []
          { ...baseComponents[1], dependsOn: ['db'] }, // api depends on db
          baseComponents[2]  // db — no dependsOn
        ]
      };
      const result = BlueprintSchema.safeParse(bp);
      assert.equal(result.success, true, `Expected success; got: ${JSON.stringify(result.error?.issues)}`);
      const api = result.data.components.find(c => c.id === 'api');
      assert.deepEqual(api.dependsOn, ['db']);
    });

    it('rejects a component that lists itself in dependsOn (self-dependency)', () => {
      const bp = {
        ...baseBlueprint,
        components: [
          baseComponents[0],
          { ...baseComponents[1], dependsOn: ['api'] }, // api depends on itself
          baseComponents[2]
        ]
      };
      const result = BlueprintSchema.safeParse(bp);
      assert.equal(result.success, false);
      const issue = result.error.issues.find(i => i.message.includes("cannot depend on itself"));
      assert.ok(issue, `Expected self-dependency error; got: ${JSON.stringify(result.error.issues)}`);
    });

    it('rejects duplicate entries within a single component dependsOn array', () => {
      const bp = {
        ...baseBlueprint,
        components: [
          baseComponents[0],
          { ...baseComponents[1], dependsOn: ['db', 'db'] }, // db listed twice
          baseComponents[2]
        ]
      };
      const result = BlueprintSchema.safeParse(bp);
      assert.equal(result.success, false);
      const issue = result.error.issues.find(i => i.message.includes("Duplicate dependsOn entry 'db'"));
      assert.ok(issue, `Expected duplicate dependsOn error; got: ${JSON.stringify(result.error.issues)}`);
    });

    it('rejects dependsOn referencing a component ID not present in the blueprint', () => {
      const bp = {
        ...baseBlueprint,
        components: [
          baseComponents[0],
          { ...baseComponents[1], dependsOn: ['ghost_service'] }, // ghost_service does not exist
          baseComponents[2]
        ]
      };
      const result = BlueprintSchema.safeParse(bp);
      assert.equal(result.success, false);
      const issue = result.error.issues.find(i => i.message.includes("dependsOn unknown component 'ghost_service'"));
      assert.ok(issue, `Expected unknown component error; got: ${JSON.stringify(result.error.issues)}`);
    });

    it('defaults dependsOn to empty array when field is absent', () => {
      const result = BlueprintSchema.safeParse(baseBlueprint);
      assert.equal(result.success, true);
      for (const comp of result.data.components) {
        assert.deepEqual(comp.dependsOn, [], `Expected dependsOn:[] on ${comp.id}`);
      }
    });
  });

});

