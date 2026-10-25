/**
 * Deployment Dependency Graph
 *
 * Builds a directed graph from the explicit `dependsOn` field on each component.
 * This is SEPARATE from the communication graph (connections).
 *
 * Semantics:
 *   If component A has dependsOn: ['B', 'C'], then edges A -> B and A -> C are added.
 *   In deployment order (dependencies-first), B and C must appear before A.
 *
 * Deliberately does not infer deployment order from communication connections.
 * That ambiguity is documented in sort.js and must be resolved at the contract level.
 */

const { LogicalGraph, buildGraph } = require('./graph');
const { topologicalSort } = require('./sort');
const { detectCycles } = require('./cycles');

/**
 * Builds a LogicalGraph from the `dependsOn` fields of Blueprint components.
 *
 * Each component becomes a node. For every entry in `comp.dependsOn`, a directed
 * edge comp.id -> depId is added (meaning: comp depends on depId, so depId must
 * be provisioned first).
 *
 * Components without a `dependsOn` field (or with an empty array) are still added
 * as isolated nodes — they have no prerequisite and can be provisioned at any time.
 *
 * @param {object|Array} blueprintOrComponents - Canonical Blueprint or array of components
 * @param {Array} [optionalComponents] - If first arg is an array, this param is unused
 * @returns {LogicalGraph}
 */
function buildDependencyGraph(blueprintOrComponents, optionalComponents) {
  if (blueprintOrComponents instanceof LogicalGraph) {
    return blueprintOrComponents;
  }

  let components = [];

  if (Array.isArray(blueprintOrComponents)) {
    components = blueprintOrComponents;
  } else if (blueprintOrComponents && typeof blueprintOrComponents === 'object') {
    components = Array.isArray(blueprintOrComponents.components)
      ? blueprintOrComponents.components
      : [];
  }

  const graph = new LogicalGraph();

  // First pass: add all nodes so endpoint checks in the second pass are correct
  for (const comp of components) {
    if (comp && comp.id) {
      graph.addNode(comp);
    }
  }

  // Second pass: add edges from dependsOn declarations
  for (const comp of components) {
    if (!comp || !comp.id) continue;
    const deps = Array.isArray(comp.dependsOn) ? comp.dependsOn : [];
    for (let i = 0; i < deps.length; i++) {
      const depId = deps[i];
      graph.addEdge({
        id: `dep_${comp.id}_${depId}`,
        from: comp.id,
        to: depId,
        purpose: 'depends_on'
      });
    }
  }

  return graph;
}

/**
 * Computes a deterministic deployment order from `dependsOn` declarations.
 *
 * Returns components in dependency-first order: if A dependsOn B, then B
 * appears before A in the result. Components with no dependencies appear first.
 *
 * @param {object|LogicalGraph} blueprintOrComponents
 * @param {object} [options]
 * @param {number} [options.maxCycles=1000] - Passed to cycle detector when cycles exist
 * @returns {object} Result matching topologicalSort shape plus:
 *   - { isAcyclic, success, order, hasCycle, cycle, cycles, unresolved, graphIsValid, diagnostics }
 */
function getDependencyDeployOrder(blueprintOrComponents, options = {}) {
  const depGraph = buildDependencyGraph(blueprintOrComponents);
  return topologicalSort(depGraph, {
    ...options,
    direction: 'dependencies-first'
  });
}

/**
 * Detects directed cycles in the deployment-dependency graph built from `dependsOn`.
 *
 * @param {object|LogicalGraph} blueprintOrComponents
 * @param {object} [options] - Passed to detectCycles
 * @returns {object} detectCycles result
 */
function detectDependencyCycles(blueprintOrComponents, options = {}) {
  const depGraph = buildDependencyGraph(blueprintOrComponents);
  return detectCycles(depGraph, options);
}

module.exports = {
  buildDependencyGraph,
  getDependencyDeployOrder,
  detectDependencyCycles
};
