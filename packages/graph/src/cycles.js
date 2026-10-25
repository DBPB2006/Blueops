/**
 * Cycle Detection for Logical Directed Graphs
 * 
 * Detects and reports directed cycles (self-loops, 2-node cycles, multi-node cycles).
 * Reports cycle presence as a pure graph property without declaring business validity.
 * Results are deterministic and formatted for downstream validator consumption.
 * 
 * Performance & Bounds:
 * - `hasAnyCycle()` performs a fast O(V + E) 3-color DFS to check for back-edges.
 * - `detectCycles()` enumerates elementary simple cycles up to `options.maxCycles` (default 1000).
 * - If the safety limit is reached, `limitExceeded: true` is returned to signal that cycle
 *   enumeration was bounded and is not an exhaustive list.
 * - Callers who only need existence checking should use `hasAnyCycle()` or pass `{ findPaths: false }`
 *   to avoid unnecessary path enumeration.
 */

const { buildGraph, LogicalGraph } = require('./graph');

/**
 * Checks for directed cycles using 3-color DFS (White=0, Gray=1, Black=2).
 * Fast O(V + E) existence check without path enumeration.
 * 
 * @param {LogicalGraph|object} graphOrBlueprint
 * @returns {boolean} True if at least one directed cycle exists
 */
function hasAnyCycle(graphOrBlueprint) {
  const graph = buildGraph(graphOrBlueprint);
  const COLOR_WHITE = 0;
  const COLOR_GRAY = 1;
  const COLOR_BLACK = 2;

  const colors = new Map();
  const nodeIds = graph.getNodeIds().sort();

  for (const id of nodeIds) {
    colors.set(id, COLOR_WHITE);
  }

  function dfs(u) {
    colors.set(u, COLOR_GRAY);

    const neighbors = graph.getOutgoing(u);
    for (const v of neighbors) {
      const vColor = colors.get(v);
      if (vColor === COLOR_GRAY) {
        // Back-edge found -> cycle exists
        return true;
      }
      if (vColor === COLOR_WHITE) {
        if (dfs(v)) {
          return true;
        }
      }
    }

    colors.set(u, COLOR_BLACK);
    return false;
  }

  for (const id of nodeIds) {
    if (colors.get(id) === COLOR_WHITE) {
      if (dfs(id)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Finds elementary directed cycles in the graph deterministically, bounded by maxCycles.
 * 
 * Explores simple cycles starting from each node, enforcing that subsequent nodes
 * in the path are lexicographically greater than the starting node. This guarantees
 * each elementary cycle is discovered exactly once starting at its minimal vertex.
 * 
 * @param {LogicalGraph} graph
 * @param {number} [maxCycles=1000] - Safety bound against combinatorial cycle explosion
 * @returns {{ cycles: string[][], limitExceeded: boolean }}
 */
function findElementaryCycles(graph, maxCycles = 1000) {
  const nodeIds = graph.getNodeIds().slice().sort();
  const cycles = [];
  const seenCycles = new Set();
  let limitExceeded = false;

  for (let i = 0; i < nodeIds.length; i++) {
    const startNode = nodeIds[i];
    const visitedOnPath = new Set([startNode]);
    const path = [startNode];

    function dfs(current) {
      if (cycles.length >= maxCycles) {
        limitExceeded = true;
        return;
      }

      const neighbors = graph.getOutgoing(current).slice().sort();
      for (const next of neighbors) {
        if (next === startNode) {
          // Cycle closed back to startNode
          const cyclePath = [...path, startNode];
          const key = cyclePath.join('->');
          if (!seenCycles.has(key)) {
            seenCycles.add(key);
            cycles.push(cyclePath);
            if (cycles.length >= maxCycles) {
              limitExceeded = true;
              return;
            }
          }
        } else if (!visitedOnPath.has(next) && next > startNode) {
          visitedOnPath.add(next);
          path.push(next);
          dfs(next);
          path.pop();
          visitedOnPath.delete(next);
        }
      }
    }

    dfs(startNode);

    if (cycles.length >= maxCycles) {
      limitExceeded = true;
      break;
    }
  }

  // Deterministically sort cycles by path length then lexicographically
  cycles.sort((a, b) => {
    if (a.length !== b.length) {
      return a.length - b.length;
    }
    return a.join('->').localeCompare(b.join('->'));
  });

  return { cycles, limitExceeded };
}

/**
 * Detects directed cycles in a Blueprint or LogicalGraph.
 * 
 * Pure graph analysis: reports graph structural properties without imposing business rules.
 * 
 * @param {LogicalGraph|object} graphOrBlueprint
 * @param {object} [options]
 * @param {number} [options.maxCycles=1000] - Maximum number of elementary cycles to collect
 * @param {boolean} [options.findPaths=true] - If false, skips cycle enumeration once cycle existence is known
 * @returns {object} { hasCycle, cycles, cycleCount, componentsInCycles, limitExceeded, maxCycles }
 */
function detectCycles(graphOrBlueprint, options = {}) {
  const graph = buildGraph(graphOrBlueprint);
  const maxCycles = typeof options.maxCycles === 'number' && options.maxCycles >= 0 ? options.maxCycles : 1000;
  const findPaths = options.findPaths !== false;

  // Fast check: if no back-edges exist, avoid full cycle enumeration
  if (!hasAnyCycle(graph)) {
    return {
      hasCycle: false,
      cycles: [],
      cycleCount: 0,
      componentsInCycles: [],
      limitExceeded: false,
      maxCycles
    };
  }

  // Caller requested fast check without enumerating paths
  if (!findPaths || maxCycles === 0) {
    return {
      hasCycle: true,
      cycles: [],
      cycleCount: null,
      componentsInCycles: [],
      limitExceeded: false,
      maxCycles
    };
  }

  const { cycles, limitExceeded } = findElementaryCycles(graph, maxCycles);
  const componentSet = new Set();
  for (const cycle of cycles) {
    for (const node of cycle) {
      componentSet.add(node);
    }
  }

  return {
    hasCycle: true,
    cycles,
    cycleCount: cycles.length,
    componentsInCycles: Array.from(componentSet).sort(),
    limitExceeded,
    maxCycles
  };
}

module.exports = {
  detectCycles,
  hasAnyCycle
};
