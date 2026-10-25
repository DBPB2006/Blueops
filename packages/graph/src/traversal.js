/**
 * Graph Traversal and Connectivity Utilities
 * 
 * Provides pure utilities to inspect reachability, isolated/disconnected components,
 * weakly connected components, and transitive dependencies in Blueprint architectures.
 */

const { buildGraph, LogicalGraph } = require('./graph');

/**
 * Returns all disconnected (isolated) components that have no incoming or outgoing connections.
 * 
 * @param {LogicalGraph|object} graphOrBlueprint
 * @returns {string[]} Sorted array of isolated component IDs
 */
function getDisconnectedComponents(graphOrBlueprint) {
  const graph = buildGraph(graphOrBlueprint);
  const isolated = [];

  for (const id of graph.getNodeIds()) {
    if (graph.getInDegree(id) === 0 && graph.getOutDegree(id) === 0) {
      isolated.push(id);
    }
  }

  return isolated.sort();
}

/**
 * Computes weakly connected components (treating directed edges as undirected).
 * Useful for verifying if an entire architecture is connected or split across multiple islands.
 * 
 * @param {LogicalGraph|object} graphOrBlueprint
 * @returns {string[][]} Array of clusters, each cluster being a sorted array of component IDs
 */
function getConnectedComponents(graphOrBlueprint) {
  const graph = buildGraph(graphOrBlueprint);
  const nodeIds = graph.getNodeIds().slice().sort();
  const visited = new Set();
  const components = [];

  for (const id of nodeIds) {
    if (!visited.has(id)) {
      const cluster = [];
      const queue = [id];
      visited.add(id);

      while (queue.length > 0) {
        const current = queue.shift();
        cluster.push(current);

        // Undirected neighbors = incoming + outgoing
        const neighbors = new Set([
          ...graph.getOutgoing(current),
          ...graph.getIncoming(current)
        ]);

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && graph.hasNode(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }

      cluster.sort();
      components.push(cluster);
    }
  }

  // Sort clusters deterministically by the first node ID in each cluster
  components.sort((a, b) => (a[0] || '').localeCompare(b[0] || ''));
  return components;
}

/**
 * Returns direct dependencies of a component (targets of its outgoing connections).
 * 
 * @param {string} nodeId
 * @param {LogicalGraph|object} graphOrBlueprint
 * @returns {string[]}
 */
function getDirectDependencies(nodeId, graphOrBlueprint) {
  const graph = buildGraph(graphOrBlueprint);
  return graph.getOutgoing(nodeId).sort();
}

/**
 * Returns direct dependents of a component (sources of connections pointing into it).
 * 
 * @param {string} nodeId
 * @param {LogicalGraph|object} graphOrBlueprint
 * @returns {string[]}
 */
function getDirectDependents(nodeId, graphOrBlueprint) {
  const graph = buildGraph(graphOrBlueprint);
  return graph.getIncoming(nodeId).sort();
}

/**
 * Computes all transitive dependencies reachable from a given component via outgoing connections.
 * 
 * @param {string} nodeId
 * @param {LogicalGraph|object} graphOrBlueprint
 * @returns {string[]} Sorted array of reachable dependency component IDs
 */
function getTransitiveDependencies(nodeId, graphOrBlueprint) {
  const graph = buildGraph(graphOrBlueprint);
  if (!graph.hasNode(nodeId)) {
    return [];
  }

  const visited = new Set();
  const queue = [...graph.getOutgoing(nodeId)];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!visited.has(current)) {
      visited.add(current);
      for (const next of graph.getOutgoing(current)) {
        if (!visited.has(next)) {
          queue.push(next);
        }
      }
    }
  }

  return Array.from(visited).sort();
}

/**
 * Computes all transitive dependents that can reach a given component via incoming connections.
 * 
 * @param {string} nodeId
 * @param {LogicalGraph|object} graphOrBlueprint
 * @returns {string[]} Sorted array of upstream dependent component IDs
 */
function getTransitiveDependents(nodeId, graphOrBlueprint) {
  const graph = buildGraph(graphOrBlueprint);
  if (!graph.hasNode(nodeId)) {
    return [];
  }

  const visited = new Set();
  const queue = [...graph.getIncoming(nodeId)];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!visited.has(current)) {
      visited.add(current);
      for (const next of graph.getIncoming(current)) {
        if (!visited.has(next)) {
          queue.push(next);
        }
      }
    }
  }

  return Array.from(visited).sort();
}

module.exports = {
  getDisconnectedComponents,
  getConnectedComponents,
  getDirectDependencies,
  getDirectDependents,
  getTransitiveDependencies,
  getTransitiveDependents
};
