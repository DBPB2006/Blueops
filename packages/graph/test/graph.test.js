const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  LogicalGraph,
  buildGraph,
  validateConnectionReferences,
  detectCycles,
  hasAnyCycle,
  topologicalSort,
  getDependencyOrder,
  getTopologicalOrder,
  getDisconnectedComponents,
  getConnectedComponents,
  getDirectDependencies,
  getDirectDependents,
  getTransitiveDependencies,
  getTransitiveDependents
} = require('../src/index');

describe('@blueops/graph - Logical Directed Graph Utilities', () => {

  const sampleFixturePath = path.resolve(__dirname, '../../schema/fixtures/sample_fixture.json');
  const sampleFixture = JSON.parse(fs.readFileSync(sampleFixturePath, 'utf8'));

  describe('Integration with sample_fixture.json', () => {
    it('validates connection references on canonical sample fixture', () => {
      const result = validateConnectionReferences(sampleFixture);
      assert.equal(result.isValid, true);
      assert.equal(result.missingReferences.length, 0);
      assert.equal(result.duplicateComponentIds.length, 0);
      assert.equal(result.duplicateConnectionIds.length, 0);
      assert.equal(result.errors.length, 0);
    });

    it('builds a LogicalGraph correctly from sample fixture', () => {
      const graph = buildGraph(sampleFixture);
      assert.equal(graph.nodeCount, 3);
      assert.equal(graph.edgeCount, 2);
      assert.deepEqual(graph.getNodeIds().sort(), ['api', 'db', 'web']);
      assert.deepEqual(graph.getOutgoing('web'), ['api']);
      assert.deepEqual(graph.getOutgoing('api'), ['db']);
      assert.deepEqual(graph.getOutgoing('db'), []);
      assert.deepEqual(graph.getIncoming('web'), []);
      assert.deepEqual(graph.getIncoming('api'), ['web']);
      assert.deepEqual(graph.getIncoming('db'), ['api']);
    });

    it('detects no cycles in canonical sample fixture', () => {
      const result = detectCycles(sampleFixture);
      assert.equal(result.hasCycle, false);
      assert.equal(result.cycleCount, 0);
      assert.deepEqual(result.cycles, []);
      assert.deepEqual(result.componentsInCycles, []);
    });

    it('computes forward topological ordering (sources / entrypoints first)', () => {
      const result = topologicalSort(sampleFixture, { direction: 'forward' });
      assert.equal(result.isAcyclic, true);
      assert.equal(result.success, true);
      assert.deepEqual(result.order, ['web', 'api', 'db']);
      assert.equal(result.hasCycle, false);
      assert.equal(result.cycle, null);
    });

    it('computes dependency order (prerequisites / targets first)', () => {
      const result = getDependencyOrder(sampleFixture);
      assert.equal(result.isAcyclic, true);
      assert.equal(result.success, true);
      // db has no dependencies, api depends on db, web depends on api
      assert.deepEqual(result.order, ['db', 'api', 'web']);
    });

    it('evaluates reachability and connectivity on sample fixture', () => {
      assert.deepEqual(getDisconnectedComponents(sampleFixture), []);
      assert.deepEqual(getConnectedComponents(sampleFixture), [['api', 'db', 'web']]);
      assert.deepEqual(getDirectDependencies('web', sampleFixture), ['api']);
      assert.deepEqual(getTransitiveDependencies('web', sampleFixture), ['api', 'db']);
      assert.deepEqual(getDirectDependents('db', sampleFixture), ['api']);
      assert.deepEqual(getTransitiveDependents('db', sampleFixture), ['api', 'web']);
    });
  });

  describe('Connection Reference Validation', () => {
    it('accepts connections when all source and target IDs exist', () => {
      const blueprint = {
        components: [{ id: 'comp_1' }, { id: 'comp_2' }],
        connections: [{ id: 'conn_1_2', from: 'comp_1', to: 'comp_2' }]
      };
      const result = validateConnectionReferences(blueprint);
      assert.equal(result.isValid, true);
      assert.deepEqual(result.missingReferences, []);
    });

    it('identifies missing target component without throwing', () => {
      const blueprint = {
        components: [{ id: 'api' }],
        connections: [{ id: 'conn_dangling', from: 'api', to: 'missing_db' }]
      };
      const result = validateConnectionReferences(blueprint);
      assert.equal(result.isValid, false);
      assert.equal(result.missingReferences.length, 1);
      assert.equal(result.missingReferences[0].connectionId, 'conn_dangling');
      assert.equal(result.missingReferences[0].field, 'to');
      assert.equal(result.missingReferences[0].referencedId, 'missing_db');
      assert.ok(result.errors[0].includes("references missing 'to' component 'missing_db'"));
    });

    it('identifies missing source component without throwing', () => {
      const blueprint = {
        components: [{ id: 'db' }],
        connections: [{ id: 'conn_orphan', from: 'missing_source', to: 'db' }]
      };
      const result = validateConnectionReferences(blueprint);
      assert.equal(result.isValid, false);
      assert.equal(result.missingReferences.length, 1);
      assert.equal(result.missingReferences[0].connectionId, 'conn_orphan');
      assert.equal(result.missingReferences[0].field, 'from');
      assert.equal(result.missingReferences[0].referencedId, 'missing_source');
    });

    it('identifies both source and target missing on the same connection', () => {
      const blueprint = {
        components: [{ id: 'other' }],
        connections: [{ id: 'conn_ghost', from: 'ghost_from', to: 'ghost_to' }]
      };
      const result = validateConnectionReferences(blueprint);
      assert.equal(result.isValid, false);
      assert.equal(result.missingReferences.length, 2);
      assert.equal(result.missingReferences[0].field, 'from');
      assert.equal(result.missingReferences[1].field, 'to');
    });

    it('handles empty or malformed connection fields gracefully', () => {
      const blueprint = {
        components: [{ id: 'api' }],
        connections: [
          { id: 'conn_bad', from: '', to: null },
          null
        ]
      };
      const result = validateConnectionReferences(blueprint);
      assert.equal(result.isValid, false);
      assert.ok(result.missingReferences.length >= 2);
    });

    it('detects duplicate component IDs and connection IDs in raw data', () => {
      const blueprint = {
        components: [{ id: 'api' }, { id: 'api' }],
        connections: [
          { id: 'c1', from: 'api', to: 'api' },
          { id: 'c1', from: 'api', to: 'api' }
        ]
      };
      const result = validateConnectionReferences(blueprint);
      assert.equal(result.isValid, false);
      assert.deepEqual(result.duplicateComponentIds, ['api']);
      assert.deepEqual(result.duplicateConnectionIds, ['c1']);
    });

    it('validates connection references when passed a LogicalGraph instance directly', () => {
      const graph = new LogicalGraph();
      graph.addNode({ id: 'web' });
      graph.addNode({ id: 'api' });
      graph.addEdge({ id: 'conn_1', from: 'web', to: 'api' });

      const result = validateConnectionReferences(graph);
      assert.equal(result.isValid, true);
      assert.equal(result.missingReferences.length, 0);

      // Add a dangling connection to graph
      graph.addEdge({ id: 'conn_bad', from: 'web', to: 'missing' });
      const badResult = validateConnectionReferences(graph);
      assert.equal(badResult.isValid, false);
      assert.equal(badResult.missingReferences.length, 1);
      assert.equal(badResult.missingReferences[0].referencedId, 'missing');
    });

    it('flags malformed component definitions lacking valid string IDs', () => {
      const blueprint = {
        components: [{ notAnId: 'oops' }, null, { id: '' }],
        connections: []
      };
      const result = validateConnectionReferences(blueprint);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.length >= 3);
    });
  });

  describe('Cycle Detection', () => {
    it('reports no cycles for linear chains and DAGs', () => {
      const dag = {
        components: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'a', to: 'c' },
          { id: 'c3', from: 'b', to: 'd' },
          { id: 'c4', from: 'c', to: 'd' }
        ]
      };
      const result = detectCycles(dag);
      assert.equal(result.hasCycle, false);
      assert.equal(result.cycleCount, 0);
      assert.deepEqual(result.cycles, []);
    });

    it('detects a self-loop (component connecting to itself)', () => {
      const selfLoop = {
        components: [{ id: 'api' }],
        connections: [{ id: 'c_loop', from: 'api', to: 'api' }]
      };
      const result = detectCycles(selfLoop);
      assert.equal(result.hasCycle, true);
      assert.equal(result.cycleCount, 1);
      assert.deepEqual(result.cycles, [['api', 'api']]);
      assert.deepEqual(result.componentsInCycles, ['api']);
    });

    it('detects a 2-node cycle (bidirectional relationship)', () => {
      const biDirectional = {
        components: [{ id: 'serviceA' }, { id: 'serviceB' }],
        connections: [
          { id: 'c1', from: 'serviceA', to: 'serviceB' },
          { id: 'c2', from: 'serviceB', to: 'serviceA' }
        ]
      };
      const result = detectCycles(biDirectional);
      assert.equal(result.hasCycle, true);
      assert.equal(result.cycleCount, 1);
      assert.deepEqual(result.cycles, [['serviceA', 'serviceB', 'serviceA']]);
      assert.deepEqual(result.componentsInCycles, ['serviceA', 'serviceB']);
    });

    it('detects a 3-node cycle', () => {
      const cycle3 = {
        components: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'b', to: 'c' },
          { id: 'c3', from: 'c', to: 'a' }
        ]
      };
      const result = detectCycles(cycle3);
      assert.equal(result.hasCycle, true);
      assert.equal(result.cycleCount, 1);
      assert.deepEqual(result.cycles, [['a', 'b', 'c', 'a']]);
      assert.deepEqual(result.componentsInCycles, ['a', 'b', 'c']);
    });

    it('detects multiple disjoint cycles in separate components of the graph', () => {
      const multiCycles = {
        components: [
          { id: 'a' }, { id: 'b' },
          { id: 'x' }, { id: 'y' }, { id: 'z' }
        ],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'b', to: 'a' },
          { id: 'c3', from: 'x', to: 'y' },
          { id: 'c4', from: 'y', to: 'z' },
          { id: 'c5', from: 'z', to: 'x' }
        ]
      };
      const result = detectCycles(multiCycles);
      assert.equal(result.hasCycle, true);
      assert.equal(result.cycleCount, 2);
      assert.deepEqual(result.cycles, [
        ['a', 'b', 'a'],
        ['x', 'y', 'z', 'x']
      ]);
      assert.deepEqual(result.componentsInCycles, ['a', 'b', 'x', 'y', 'z']);
    });

    it('detects cycles embedded within larger acyclic graph without affecting acyclic nodes', () => {
      const hybrid = {
        components: [
          { id: 'entry' },
          { id: 'c1' },
          { id: 'c2' },
          { id: 'exit' }
        ],
        connections: [
          { id: 'e1', from: 'entry', to: 'c1' },
          { id: 'e2', from: 'c1', to: 'c2' },
          { id: 'e3', from: 'c2', to: 'c1' }, // cycle between c1 and c2
          { id: 'e4', from: 'c2', to: 'exit' }
        ]
      };
      const result = detectCycles(hybrid);
      assert.equal(result.hasCycle, true);
      assert.deepEqual(result.cycles, [['c1', 'c2', 'c1']]);
      assert.deepEqual(result.componentsInCycles, ['c1', 'c2']);
    });

    it('canonicalizes cycle representation regardless of node declaration order', () => {
      // Cycle is B -> C -> A -> B
      const permuted = {
        components: [{ id: 'b' }, { id: 'c' }, { id: 'a' }],
        connections: [
          { id: 'c1', from: 'b', to: 'c' },
          { id: 'c2', from: 'c', to: 'a' },
          { id: 'c3', from: 'a', to: 'b' }
        ]
      };
      const result = detectCycles(permuted);
      // Canonical representation starts at minimum node 'a'
      assert.deepEqual(result.cycles, [['a', 'b', 'c', 'a']]);
    });

    it('reports cycle properties purely without asserting business invalidity or throwing', () => {
      const cyclic = {
        components: [{ id: 'a' }, { id: 'b' }],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'b', to: 'a' }
        ]
      };
      // Must not throw or crash; must return structured data
      assert.doesNotThrow(() => {
        const res = detectCycles(cyclic);
        assert.equal(res.hasCycle, true);
      });
    });

    it('bounds cycle enumeration and flags limitExceeded when maxCycles is reached', () => {
      // Graph with 3 cycles: a <-> b, b <-> c, a <-> c
      const multi = {
        components: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'b', to: 'a' },
          { id: 'c3', from: 'b', to: 'c' },
          { id: 'c4', from: 'c', to: 'b' },
          { id: 'c5', from: 'a', to: 'c' },
          { id: 'c6', from: 'c', to: 'a' }
        ]
      };
      const result = detectCycles(multi, { maxCycles: 2 });
      assert.equal(result.hasCycle, true);
      assert.equal(result.cycles.length, 2);
      assert.equal(result.limitExceeded, true);
      assert.equal(result.maxCycles, 2);
    });

    it('avoids unnecessary cycle enumeration when findPaths is false', () => {
      const cyclic = {
        components: [{ id: 'a' }, { id: 'b' }],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'b', to: 'a' }
        ]
      };
      const result = detectCycles(cyclic, { findPaths: false });
      assert.equal(result.hasCycle, true);
      assert.deepEqual(result.cycles, []);
      assert.equal(result.cycleCount, null);
      assert.equal(result.limitExceeded, false);
    });

    it('hasAnyCycle works directly on blueprints without cycle path enumeration', () => {
      const cyclic = {
        components: [{ id: 'a' }, { id: 'b' }],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'b', to: 'a' }
        ]
      };
      assert.equal(hasAnyCycle(cyclic), true);

      const acyclic = {
        components: [{ id: 'a' }, { id: 'b' }],
        connections: [{ id: 'c1', from: 'a', to: 'b' }]
      };
      assert.equal(hasAnyCycle(acyclic), false);
    });
  });

  describe('Topological Sorting', () => {
    it('returns a deterministic topological order for linear graph', () => {
      const linear = {
        components: [{ id: 'web' }, { id: 'api' }, { id: 'db' }],
        connections: [
          { id: 'c1', from: 'web', to: 'api' },
          { id: 'c2', from: 'api', to: 'db' }
        ]
      };
      const res = topologicalSort(linear);
      assert.equal(res.isAcyclic, true);
      assert.equal(res.success, true);
      assert.deepEqual(res.order, ['web', 'api', 'db']);
    });

    it('deterministically breaks ties when multiple valid topological orders exist', () => {
      // A connects to C; B connects to C. Both [A, B, C] and [B, A, C] are valid.
      const diamond = {
        components: [{ id: 'b' }, { id: 'a' }, { id: 'c' }],
        connections: [
          { id: 'c1', from: 'a', to: 'c' },
          { id: 'c2', from: 'b', to: 'c' }
        ]
      };
      const res1 = topologicalSort(diamond);
      assert.equal(res1.isAcyclic, true);
      assert.deepEqual(res1.order, ['a', 'b', 'c']);

      // Shuffling component order must still yield the exact same deterministic order
      const diamondShuffled = {
        components: [{ id: 'c' }, { id: 'b' }, { id: 'a' }],
        connections: diamond.connections
      };
      const res2 = topologicalSort(diamondShuffled);
      assert.deepEqual(res2.order, ['a', 'b', 'c']);
    });

    it('supports custom tie-breaker comparator', () => {
      const independent = {
        components: [{ id: 'x' }, { id: 'y' }, { id: 'z' }],
        connections: []
      };
      // Reverse alphabetical tie breaker
      const res = topologicalSort(independent, {
        tieBreaker: (a, b) => b.localeCompare(a)
      });
      assert.deepEqual(res.order, ['z', 'y', 'x']);
    });

    it('returns clear structured failure with order: null when cycle exists', () => {
      const cyclic = {
        components: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
        connections: [
          { id: 'c1', from: 'a', to: 'b' },
          { id: 'c2', from: 'b', to: 'c' },
          { id: 'c3', from: 'c', to: 'a' }
        ]
      };
      const res = topologicalSort(cyclic);
      assert.equal(res.isAcyclic, false);
      assert.equal(res.success, false);
      assert.equal(res.order, null, 'Must NOT return partial order as complete');
      assert.equal(res.hasCycle, true);
      assert.deepEqual(res.cycle, ['a', 'b', 'c', 'a']);
      assert.deepEqual(res.unresolved, ['a', 'b', 'c']);
      assert.ok(res.error.includes('Graph contains directed cycles'));
    });

    it('identifies unresolved components when cycle is a subgraph', () => {
      const partialCycle = {
        components: [{ id: 'root' }, { id: 'cycle1' }, { id: 'cycle2' }],
        connections: [
          { id: 'c1', from: 'root', to: 'cycle1' },
          { id: 'c2', from: 'cycle1', to: 'cycle2' },
          { id: 'c3', from: 'cycle2', to: 'cycle1' }
        ]
      };
      const res = topologicalSort(partialCycle);
      assert.equal(res.isAcyclic, false);
      assert.equal(res.order, null);
      assert.deepEqual(res.unresolved, ['cycle1', 'cycle2']);
      assert.deepEqual(res.cycle, ['cycle1', 'cycle2', 'cycle1']);
    });

    it('fails clearly on self-loop', () => {
      const loop = {
        components: [{ id: 'worker' }],
        connections: [{ id: 'c1', from: 'worker', to: 'worker' }]
      };
      const res = topologicalSort(loop);
      assert.equal(res.isAcyclic, false);
      assert.equal(res.order, null);
      assert.deepEqual(res.cycle, ['worker', 'worker']);
      assert.deepEqual(res.unresolved, ['worker']);
    });

    it('computes dependency order correctly for tree architecture', () => {
      // web -> api -> db
      // worker -> db
      const tree = {
        components: [{ id: 'web' }, { id: 'api' }, { id: 'worker' }, { id: 'db' }],
        connections: [
          { id: 'c1', from: 'web', to: 'api' },
          { id: 'c2', from: 'api', to: 'db' },
          { id: 'c3', from: 'worker', to: 'db' }
        ]
      };
      const depOrder = getDependencyOrder(tree);
      assert.equal(depOrder.isAcyclic, true);
      // db has 0 dependencies. Both api and worker depend on db.
      // Once db and api are resolved, web and worker both have all dependencies satisfied.
      // Deterministic tie-breaker selects 'web' before 'worker' ('web' < 'worker').
      assert.deepEqual(depOrder.order, ['db', 'api', 'web', 'worker']);
    });
  });

  describe('Edge-case Behavior', () => {
    it('handles empty graphs cleanly', () => {
      const empty = { components: [], connections: [] };

      const refResult = validateConnectionReferences(empty);
      assert.equal(refResult.isValid, true);
      assert.deepEqual(refResult.missingReferences, []);

      const cycleResult = detectCycles(empty);
      assert.equal(cycleResult.hasCycle, false);
      assert.deepEqual(cycleResult.cycles, []);

      const sortResult = topologicalSort(empty);
      assert.equal(sortResult.isAcyclic, true);
      assert.deepEqual(sortResult.order, []);

      assert.deepEqual(getDisconnectedComponents(empty), []);
      assert.deepEqual(getConnectedComponents(empty), []);
    });

    it('handles completely disconnected components', () => {
      const disconnected = {
        components: [{ id: 'comp_c' }, { id: 'comp_a' }, { id: 'comp_b' }],
        connections: []
      };

      const refResult = validateConnectionReferences(disconnected);
      assert.equal(refResult.isValid, true);

      const cycleResult = detectCycles(disconnected);
      assert.equal(cycleResult.hasCycle, false);

      // Deterministically sorts all disconnected components
      const sortResult = topologicalSort(disconnected);
      assert.equal(sortResult.isAcyclic, true);
      assert.deepEqual(sortResult.order, ['comp_a', 'comp_b', 'comp_c']);

      assert.deepEqual(getDisconnectedComponents(disconnected), ['comp_a', 'comp_b', 'comp_c']);
      assert.deepEqual(getConnectedComponents(disconnected), [
        ['comp_a'],
        ['comp_b'],
        ['comp_c']
      ]);
    });

    it('handles missing component references in connections without crashing and exposes invalid input diagnostics', () => {
      const dangling = {
        components: [{ id: 'web' }],
        connections: [{ id: 'c1', from: 'web', to: 'non_existent' }]
      };

      // Reference validation catches it
      const val = validateConnectionReferences(dangling);
      assert.equal(val.isValid, false);
      assert.equal(val.missingReferences[0].referencedId, 'non_existent');

      // buildGraph isolates dangling edges in danglingConnections without crashing
      const graph = buildGraph(dangling);
      assert.equal(graph.nodeCount, 1);
      assert.equal(graph.edgeCount, 0);
      assert.equal(graph.danglingConnections.length, 1);
      assert.equal(graph.isValid, false, 'Graph built with dangling connections must have isValid === false');
      assert.equal(graph.diagnostics.isValid, false);
      assert.equal(graph.diagnostics.missingReferences.length, 1);

      // detectCycles and topologicalSort operate safely on valid nodes
      const cycles = detectCycles(graph);
      assert.equal(cycles.hasCycle, false);

      // Topological sort succeeds on retained nodes, but explicitly reports that graph input was invalid
      const sort = topologicalSort(graph);
      assert.equal(sort.isAcyclic, true);
      assert.deepEqual(sort.order, ['web']);
      assert.equal(sort.graphIsValid, false, 'Successful sort on retained graph must NOT imply original input was valid');
      assert.equal(sort.diagnostics.isValid, false);
      assert.equal(sort.diagnostics.danglingConnections.length, 1);
    });

    it('safely handles duplicate component IDs in addNode and buildGraph without silent acceptance', () => {
      const graph = new LogicalGraph();
      assert.equal(graph.addNode({ id: 'api', kind: 'api_service' }), true);
      // Second addition with same ID must return false and register duplicate
      assert.equal(graph.addNode({ id: 'api', kind: 'postgres' }), false);
      assert.deepEqual(graph.duplicateComponentIds, ['api']);
      assert.equal(graph.isValid, false);
      assert.equal(graph.diagnostics.isValid, false);
      assert.deepEqual(graph.diagnostics.duplicateComponentIds, ['api']);

      // buildGraph with duplicate component IDs
      const rawWithDups = {
        components: [
          { id: 'api', kind: 'api_service' },
          { id: 'api', kind: 'postgres' }
        ],
        connections: []
      };
      const builtGraph = buildGraph(rawWithDups);
      assert.equal(builtGraph.nodeCount, 1);
      assert.deepEqual(builtGraph.duplicateComponentIds, ['api']);
      assert.equal(builtGraph.isValid, false);
      assert.equal(builtGraph.diagnostics.isValid, false);
    });

    it('detects duplicate connection IDs when first use of ID was dangling (regression: addEdge set-based check)', () => {
      // Regression: old addEdge checked this.edges.some() which only covered valid edges.
      // If conn_x was added with a missing endpoint first (landing in danglingConnections),
      // then the same ID was added again with valid endpoints, the duplicate was silently missed.
      const graph = new LogicalGraph();
      graph.addNode({ id: 'a' });
      graph.addNode({ id: 'b' });

      // First use: dangling — 'ghost' does not exist, so this goes to danglingConnections
      const added1 = graph.addEdge({ id: 'conn_x', from: 'a', to: 'ghost' });
      assert.equal(added1, false, 'Edge with missing target must not be added to adjacency');
      assert.equal(graph.danglingConnections.length, 1);
      assert.equal(graph.duplicateConnectionIds.length, 0, 'No duplicate yet after first use');

      // Second use: same ID, but valid endpoints this time — must be caught as duplicate
      const added2 = graph.addEdge({ id: 'conn_x', from: 'a', to: 'b' });
      assert.equal(added2, true, 'Second edge (valid endpoints) is added to adjacency');
      assert.deepEqual(graph.duplicateConnectionIds, ['conn_x'], 'Duplicate conn ID must be registered');
      assert.equal(graph.isValid, false, 'Graph with duplicate connection ID must report isValid false');
      assert.deepEqual(graph.diagnostics.duplicateConnectionIds, ['conn_x']);
    });

    it('distinguishes a graph built from clean valid input from one built after filtering invalid elements', () => {
      const cleanInput = {
        components: [{ id: 'web' }, { id: 'api' }],
        connections: [{ id: 'c1', from: 'web', to: 'api' }]
      };
      const cleanGraph = buildGraph(cleanInput);
      assert.equal(cleanGraph.isValid, true);
      assert.equal(cleanGraph.diagnostics.isValid, true);
      assert.deepEqual(cleanGraph.diagnostics.danglingConnections, []);
      assert.deepEqual(cleanGraph.diagnostics.duplicateComponentIds, []);

      const sortClean = topologicalSort(cleanGraph);
      assert.equal(sortClean.success, true);
      assert.equal(sortClean.graphIsValid, true);
      assert.equal(sortClean.diagnostics.isValid, true);

      const dirtyInput = {
        components: [{ id: 'web' }, { id: 'api' }],
        connections: [
          { id: 'c1', from: 'web', to: 'api' },
          { id: 'c2_bad', from: 'web', to: 'ghost' }
        ]
      };
      const dirtyGraph = buildGraph(dirtyInput);
      assert.equal(dirtyGraph.isValid, false);
      assert.equal(dirtyGraph.danglingConnections.length, 1);

      const sortDirty = topologicalSort(dirtyGraph);
      // Topological sort of retained nodes succeeds, but graphIsValid is false
      assert.equal(sortDirty.success, true);
      assert.deepEqual(sortDirty.order, ['web', 'api']);
      assert.equal(sortDirty.graphIsValid, false);
      assert.equal(sortDirty.diagnostics.danglingConnections.length, 1);
    });

    it('partitions weakly connected components into distinct clusters', () => {
      // Cluster 1: frontend -> api -> db
      // Cluster 2: worker -> queue
      // Cluster 3: standalone_cache
      const multiCluster = {
        components: [
          { id: 'frontend' }, { id: 'api' }, { id: 'db' },
          { id: 'worker' }, { id: 'queue' },
          { id: 'standalone_cache' }
        ],
        connections: [
          { id: 'c1', from: 'frontend', to: 'api' },
          { id: 'c2', from: 'api', to: 'db' },
          { id: 'c3', from: 'worker', to: 'queue' }
        ]
      };

      const clusters = getConnectedComponents(multiCluster);
      assert.equal(clusters.length, 3);
      assert.deepEqual(clusters, [
        ['api', 'db', 'frontend'],
        ['queue', 'worker'],
        ['standalone_cache']
      ]);

      const isolated = getDisconnectedComponents(multiCluster);
      assert.deepEqual(isolated, ['standalone_cache']);
    });

    it('correctly reports transitive dependencies for non-existent nodes', () => {
      const graph = buildGraph({ components: [{ id: 'a' }], connections: [] });
      assert.deepEqual(getTransitiveDependencies('ghost', graph), []);
      assert.deepEqual(getTransitiveDependents('ghost', graph), []);
    });
  });

  // Pull in the new dep-graph utilities
  const {
    buildDependencyGraph,
    getDependencyDeployOrder,
    detectDependencyCycles
  } = require('../src/index');

  describe('Deployment Dependency Graph (dependsOn)', () => {

    it('orders components so prerequisites appear before dependents (basic chain)', () => {
      // api depends on db; db has no deps; web has no deps
      const blueprint = {
        components: [
          { id: 'web' },
          { id: 'api', dependsOn: ['db'] },
          { id: 'db' }
        ],
        connections: []
      };
      const result = getDependencyDeployOrder(blueprint);
      assert.equal(result.isAcyclic, true);
      assert.equal(result.success, true);
      // db must appear before api; web can be anywhere
      const order = result.order;
      assert.ok(order.indexOf('db') < order.indexOf('api'),
        `Expected db before api; got: ${order}`);
    });

    it('orders a multi-level chain db -> api -> web correctly', () => {
      const blueprint = {
        components: [
          { id: 'web', dependsOn: ['api'] },
          { id: 'api', dependsOn: ['db'] },
          { id: 'db' }
        ],
        connections: []
      };
      const result = getDependencyDeployOrder(blueprint);
      assert.equal(result.success, true);
      const order = result.order;
      assert.ok(order.indexOf('db') < order.indexOf('api'),   `db must precede api; got: ${order}`);
      assert.ok(order.indexOf('api') < order.indexOf('web'), `api must precede web; got: ${order}`);
    });

    it('returns all components in deterministic order when no dependsOn is declared', () => {
      const blueprint = {
        components: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
        connections: []
      };
      const result = getDependencyDeployOrder(blueprint);
      assert.equal(result.success, true);
      assert.equal(result.order.length, 3);
      // No edges means any order is valid topologically; just verify all present
      assert.deepEqual(result.order.slice().sort(), ['a', 'b', 'c']);
    });

    it('detects a deployment dependency cycle and returns hasCycle:true / success:false', () => {
      // api depends on worker, worker depends on api — circular
      const blueprint = {
        components: [
          { id: 'api', dependsOn: ['worker'] },
          { id: 'worker', dependsOn: ['api'] }
        ],
        connections: []
      };
      const result = getDependencyDeployOrder(blueprint);
      assert.equal(result.success, false);
      assert.equal(result.isAcyclic, false);
      assert.equal(result.hasCycle, true);
      assert.equal(result.order, null);

      // detectDependencyCycles should agree
      const cycleResult = detectDependencyCycles(blueprint);
      assert.equal(cycleResult.hasCycle, true);
      assert.ok(cycleResult.componentsInCycles.includes('api'));
      assert.ok(cycleResult.componentsInCycles.includes('worker'));
    });

    it('handles a dangling dependsOn reference (unknown target) without crashing', () => {
      // Blueprint schema would reject this, but graph must tolerate it gracefully
      const blueprint = {
        components: [
          { id: 'api', dependsOn: ['ghost_db'] } // ghost_db not in components
        ],
        connections: []
      };
      const depGraph = buildDependencyGraph(blueprint);
      // ghost_db is not a node; the edge becomes dangling
      assert.equal(depGraph.nodeCount, 1);
      assert.equal(depGraph.edgeCount, 0);
      assert.equal(depGraph.danglingConnections.length, 1);
      assert.equal(depGraph.isValid, false);

      // Sort still runs safely on retained nodes
      const result = getDependencyDeployOrder(blueprint);
      assert.equal(result.success, true); // only 'api' node, no edges
      assert.deepEqual(result.order, ['api']);
      assert.equal(result.graphIsValid, false); // input had a dangling ref
    });

    it('keeps the deployment dependency graph completely separate from the communication graph', () => {
      // Communication: web -> api (sends_requests); api -> db (reads_writes)
      // Deployment: api explicitly depends on db via dependsOn
      const blueprint = {
        components: [
          { id: 'web' },
          { id: 'api', dependsOn: ['db'] },
          { id: 'db' }
        ],
        connections: [
          { id: 'c1', from: 'web', to: 'api', purpose: 'sends_requests' },
          { id: 'c2', from: 'api', to: 'db', purpose: 'reads_writes' }
        ]
      };

      // Communication graph has 2 edges
      const commGraph = buildGraph(blueprint);
      assert.equal(commGraph.edgeCount, 2);
      assert.deepEqual(commGraph.getOutgoing('web'), ['api']);

      // Dependency graph has 1 edge (api -> db from dependsOn only)
      const depGraph = buildDependencyGraph(blueprint);
      assert.equal(depGraph.edgeCount, 1);
      assert.deepEqual(depGraph.getOutgoing('api'), ['db']);
      assert.deepEqual(depGraph.getOutgoing('web'), []); // web has no dependsOn
    });

    it('sample_fixture.json has no dependsOn and produces an acyclic dependency deploy order', () => {
      const result = getDependencyDeployOrder(sampleFixture);
      assert.equal(result.success, true);
      assert.equal(result.isAcyclic, true);
      // All 3 components must appear; no edges so any order is valid
      assert.equal(result.order.length, 3);
      assert.deepEqual(result.order.slice().sort(), ['api', 'db', 'web']);
    });
  });

});

