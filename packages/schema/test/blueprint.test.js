const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
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

});
