/**
 * Deterministic Topological Sorting for Logical Directed Graphs
 * 
 * Implements Kahn's algorithm with deterministic tie-breaking.
 * 
 * Edge Semantics and Directionality in BlueOps:
 * - In BlueOps, connections in `packages/schema` define directed relationships from `from`
 *   to `to` with a semantic `purpose` (e.g., sends_requests, reads_writes, consumes_from).
 * - Graph edges are directed: `from -> to`.
 * - 'forward' ordering (default): satisfies that for every connection `from -> to`, the source
 *   component `from` appears before the target component `to`. In request flow, this places
 *   entrypoints and callers before callees.
 * - 'dependencies-first' ordering (reverse): satisfies that target components `to` appear before
 *   source components `from`, under the convention that `from` depends on `to` (e.g., API requires DB).
 * 
 * Semantic Ambiguity Note:
 * - The Blueprint schema contract does NOT define a universal mapping from connection purpose to
 *   IaC deployment order. Downstream generators (@blueops/generators) or validators (@blueops/validator)
 *   are responsible for domain-specific deployment decisions.
 * 
 * Input Validity Guarantee:
 * - Topological sort operates on the graph's retained valid components and edges. A successful sort
 *   (isAcyclic: true) confirms that the internal graph structure is acyclic. It does NOT prove that
 *   the original Blueprint had no dangling or duplicate elements. Callers must inspect `graphIsValid`
 *   or `diagnostics` to verify input integrity.
 */

const { buildGraph, LogicalGraph } = require('./graph');
const { detectCycles } = require('./cycles');

/**
 * Default deterministic tie-breaker (lexicographical sorting by ID).
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function defaultTieBreaker(a, b) {
  return a.localeCompare(b);
}

/**
 * Computes a deterministic topological ordering of the graph.
 * 
 * @param {LogicalGraph|object} graphOrBlueprint
 * @param {object} [options]
 * @param {'forward'|'dependencies-first'|'reverse'} [options.direction='forward']
 *        - 'forward': source nodes precede target nodes (e.g., web -> api -> db)
 *        - 'dependencies-first': target nodes (prerequisites) precede dependent nodes (e.g., db -> api -> web)
 * @param {function(string, string): number} [options.tieBreaker] - Custom tie-breaker for nodes with equal in-degree
 * @returns {object} Result object:
 *   - When acyclic: { isAcyclic: true, success: true, order: string[], hasCycle: false, cycle: null, cycles: [], unresolved: [], graphIsValid: boolean, diagnostics: object }
 *   - When cyclic:  { isAcyclic: false, success: false, order: null, hasCycle: true, cycle: string[], cycles: string[][], unresolved: string[], graphIsValid: boolean, diagnostics: object, error: string }
 */
function topologicalSort(graphOrBlueprint, options = {}) {
  const graph = buildGraph(graphOrBlueprint);
  const direction = options.direction || 'forward';
  const tieBreaker = typeof options.tieBreaker === 'function' ? options.tieBreaker : defaultTieBreaker;

  const nodeIds = graph.getNodeIds().slice().sort(tieBreaker);
  const totalNodes = nodeIds.length;

  // Handle empty graph edge case
  if (totalNodes === 0) {
    return {
      isAcyclic: true,
      success: true,
      order: [],
      hasCycle: false,
      cycle: null,
      cycles: [],
      unresolved: [],
      graphIsValid: graph.isValid,
      diagnostics: graph.diagnostics
    };
  }

  // Calculate in-degrees according to chosen direction
  // In 'forward' mode: edge is from -> to; in-degree is number of incoming edges to 'to'
  // In 'dependencies-first' mode: edge from -> to means 'from' depends on 'to';
  //   prerequisite 'to' must precede 'from', so effective in-degree is number of outgoing edges from 'from'
  const inDegree = new Map();
  for (const id of nodeIds) {
    if (direction === 'dependencies-first' || direction === 'reverse') {
      inDegree.set(id, graph.getOutDegree(id));
    } else {
      inDegree.set(id, graph.getInDegree(id));
    }
  }

  // Collect initial zero-indegree candidates
  const available = [];
  for (const id of nodeIds) {
    if (inDegree.get(id) === 0) {
      available.push(id);
    }
  }
  available.sort(tieBreaker);

  const order = [];

  while (available.length > 0) {
    const current = available.shift();
    order.push(current);

    // Get neighbors to decrement
    // In forward mode, removing current unblocks targets (current -> target)
    // In dependencies-first mode, removing current prerequisite unblocks dependents (dependent -> current)
    const neighbors = (direction === 'dependencies-first' || direction === 'reverse')
      ? graph.getIncoming(current)
      : graph.getOutgoing(current);

    for (const neighbor of neighbors) {
      const currentDeg = inDegree.get(neighbor);
      const newDeg = currentDeg - 1;
      inDegree.set(neighbor, newDeg);

      if (newDeg === 0) {
        // Insert into available list maintaining deterministic order
        available.push(neighbor);
        available.sort(tieBreaker);
      }
    }
  }

  if (order.length === totalNodes) {
    return {
      isAcyclic: true,
      success: true,
      order,
      hasCycle: false,
      cycle: null,
      cycles: [],
      unresolved: [],
      graphIsValid: graph.isValid,
      diagnostics: graph.diagnostics
    };
  }

  // Cycles detected: complete topological ordering is mathematically impossible.
  // Never return a partial order disguised as complete.
  const unresolved = nodeIds.filter((id) => !order.includes(id)).sort(tieBreaker);
  const cycleInfo = detectCycles(graph);

  return {
    isAcyclic: false,
    success: false,
    order: null,
    hasCycle: true,
    cycle: cycleInfo.cycles[0] || null,
    cycles: cycleInfo.cycles,
    unresolved,
    graphIsValid: graph.isValid,
    diagnostics: graph.diagnostics,
    error: 'Graph contains directed cycles; complete topological ordering is not possible.'
  };
}

/**
 * Convenience helper to compute dependency / provisioning order (prerequisites first).
 * 
 * Satisfies: for every connection `from -> to`, target `to` appears before source `from`.
 * 
 * @param {LogicalGraph|object} graphOrBlueprint
 * @param {object} [options]
 * @returns {object} Result object matching topologicalSort
 */
function getDependencyOrder(graphOrBlueprint, options = {}) {
  return topologicalSort(graphOrBlueprint, {
    ...options,
    direction: 'dependencies-first'
  });
}

/**
 * Convenience helper to compute forward topological order (entrypoints / sources first).
 * 
 * Satisfies: for every connection `from -> to`, source `from` appears before target `to`.
 * 
 * @param {LogicalGraph|object} graphOrBlueprint
 * @param {object} [options]
 * @returns {object} Result object matching topologicalSort
 */
function getTopologicalOrder(graphOrBlueprint, options = {}) {
  return topologicalSort(graphOrBlueprint, {
    ...options,
    direction: 'forward'
  });
}

module.exports = {
  topologicalSort,
  getDependencyOrder,
  getTopologicalOrder
};
