/**
 * @blueops/graph
 * 
 * Pure directed graph algorithms (reference validation, cycle detection,
 * deterministic topological sort, dependency ordering, connectivity) for BlueOps.
 */

const {
  LogicalGraph,
  buildGraph
} = require('./graph');

const {
  validateConnectionReferences
} = require('./references');

const {
  detectCycles,
  hasAnyCycle
} = require('./cycles');

const {
  topologicalSort,
  getDependencyOrder,
  getTopologicalOrder
} = require('./sort');

const {
  getDisconnectedComponents,
  getConnectedComponents,
  getDirectDependencies,
  getDirectDependents,
  getTransitiveDependencies,
  getTransitiveDependents
} = require('./traversal');

const {
  buildDependencyGraph,
  getDependencyDeployOrder,
  detectDependencyCycles
} = require('./deps');

module.exports = {
  // Graph Data Structure & Factory
  LogicalGraph,
  buildGraph,

  // Reference Validation
  validateConnectionReferences,

  // Cycle Detection
  detectCycles,
  hasAnyCycle,

  // Topological Sorting
  topologicalSort,
  getDependencyOrder,
  getTopologicalOrder,

  // Connectivity & Traversal
  getDisconnectedComponents,
  getConnectedComponents,
  getDirectDependencies,
  getDirectDependents,
  getTransitiveDependencies,
  getTransitiveDependents,

  // Deployment Dependency Graph (from dependsOn)
  buildDependencyGraph,
  getDependencyDeployOrder,
  detectDependencyCycles
};
