/**
 * Logical Directed Graph Data Structure
 * 
 * Represents the technology-independent architectural topology of a Blueprint.
 * Operates purely on component identities and directed connection relationships.
 * Completely decoupled from canvas positioning, coordinates, or layout concerns.
 * 
 * In BlueOps:
 * - Nodes represent components (services, frontends, databases, queues, etc.).
 * - Edges represent directed logical relationships defined by connection `from` (source)
 *   and `to` (target) with a descriptive `purpose`.
 * - Graph construction safely isolates invalid or dangling inputs without crashing,
 *   while making input validity explicit via `graph.isValid` and `graph.diagnostics`.
 */

const { validateConnectionReferences } = require('./references');

class LogicalGraph {
  constructor() {
    /** @type {Map<string, object>} componentId -> component data */
    this.nodes = new Map();

    /** @type {Map<string, Set<string>>} sourceId -> Set of targetIds */
    this.adjacency = new Map();

    /** @type {Map<string, Set<string>>} targetId -> Set of sourceIds */
    this.inAdjacency = new Map();

    /** @type {Array<object>} array of valid connection objects */
    this.edges = [];

    /** @type {Map<string, Array<object>>} sourceId -> connections */
    this.edgesBySource = new Map();

    /** @type {Map<string, Array<object>>} targetId -> connections */
    this.edgesByTarget = new Map();

    /** @type {Array<object>} connections referencing non-existent nodes */
    this.danglingConnections = [];

    /** @type {Array<string>} duplicate component IDs encountered during input population */
    this.duplicateComponentIds = [];

    /** @type {Array<string>} duplicate connection IDs encountered */
    this.duplicateConnectionIds = [];

    /** @type {Set<string>} all connection IDs seen (valid + dangling) for O(1) duplicate detection */
    this._connectionIdsSeen = new Set();

    /** @type {Array<object>} detailed missing reference descriptors */
    this.missingReferences = [];
  }

  /**
   * Adds a component node to the graph.
   * If a component with the same ID already exists, registers it in `duplicateComponentIds`
   * and returns false without overwriting or silently treating the input as clean.
   * 
   * @param {object|string} component - Component object or component ID string
   * @returns {boolean} True if newly added, false if already present (duplicate)
   */
  addNode(component) {
    const id = typeof component === 'string' ? component : component && component.id;
    if (!id || typeof id !== 'string') {
      throw new Error(`Invalid component node: missing valid string 'id'`);
    }

    if (this.nodes.has(id)) {
      if (!this.duplicateComponentIds.includes(id)) {
        this.duplicateComponentIds.push(id);
      }
      return false;
    }

    this.nodes.set(id, typeof component === 'object' ? component : { id });
    this.adjacency.set(id, new Set());
    this.inAdjacency.set(id, new Set());
    this.edgesBySource.set(id, []);
    this.edgesByTarget.set(id, []);
    return true;
  }

  /**
   * Checks if a node ID exists in the graph.
   * @param {string} id
   * @returns {boolean}
   */
  hasNode(id) {
    return this.nodes.has(id);
  }

  /**
   * Retrieves the component object for a given node ID.
   * @param {string} id
   * @returns {object|undefined}
   */
  getNode(id) {
    return this.nodes.get(id);
  }

  /**
   * Returns all node IDs in the graph.
   * @returns {string[]}
   */
  getNodeIds() {
    return Array.from(this.nodes.keys());
  }

  /**
   * Returns all component objects in the graph.
   * @returns {object[]}
   */
  getNodes() {
    return Array.from(this.nodes.values());
  }

  /**
   * Total number of nodes in the graph.
   * @returns {number}
   */
  get nodeCount() {
    return this.nodes.size;
  }

  /**
   * Adds a directed connection edge from source to target.
   * If either endpoint does not exist, isolates the connection in `danglingConnections`
   * and records structured details in `missingReferences` without crashing.
   * 
   * @param {object} connection - Connection object with id, from, to, purpose, etc.
   * @returns {boolean} True if successfully added to adjacency, false if dangling
   */
  addEdge(connection) {
    if (!connection || typeof connection !== 'object') {
      throw new Error(`Invalid connection edge: connection must be an object`);
    }

    const { from, to } = connection;
    const connId = connection.id || 'unknown';

    // Track duplicate connection IDs across both valid edges and dangling connections.
    // Must use a Set so that a connection first placed in danglingConnections can still
    // be correctly flagged as a duplicate if the same ID appears again.
    if (connection.id) {
      if (this._connectionIdsSeen.has(connection.id)) {
        if (!this.duplicateConnectionIds.includes(connection.id)) {
          this.duplicateConnectionIds.push(connection.id);
        }
      } else {
        this._connectionIdsSeen.add(connection.id);
      }
    }

    // Check endpoint existence
    const missingFrom = !this.nodes.has(from);
    const missingTo = !this.nodes.has(to);

    if (missingFrom || missingTo) {
      this.danglingConnections.push(connection);

      if (missingFrom) {
        this.missingReferences.push({
          connectionId: connId,
          field: 'from',
          referencedId: from,
          message: `Connection '${connId}' references missing 'from' component '${from}'`
        });
      }
      if (missingTo) {
        this.missingReferences.push({
          connectionId: connId,
          field: 'to',
          referencedId: to,
          message: `Connection '${connId}' references missing 'to' component '${to}'`
        });
      }
      return false;
    }

    this.edges.push(connection);
    this.adjacency.get(from).add(to);
    this.inAdjacency.get(to).add(from);
    this.edgesBySource.get(from).push(connection);
    this.edgesByTarget.get(to).push(connection);
    return true;
  }

  /**
   * Checks if a directed edge exists between from and to.
   * @param {string} from
   * @param {string} to
   * @returns {boolean}
   */
  hasEdge(from, to) {
    const targets = this.adjacency.get(from);
    return targets ? targets.has(to) : false;
  }

  /**
   * Returns all outgoing target node IDs from a source node.
   * @param {string} id
   * @returns {string[]}
   */
  getOutgoing(id) {
    const targets = this.adjacency.get(id);
    return targets ? Array.from(targets) : [];
  }

  /**
   * Alias for getOutgoing.
   * @param {string} id
   * @returns {string[]}
   */
  getNeighbors(id) {
    return this.getOutgoing(id);
  }

  /**
   * Returns all incoming source node IDs to a target node.
   * @param {string} id
   * @returns {string[]}
   */
  getIncoming(id) {
    const sources = this.inAdjacency.get(id);
    return sources ? Array.from(sources) : [];
  }

  /**
   * Returns out-degree (number of outgoing edges) of a node.
   * @param {string} id
   * @returns {number}
   */
  getOutDegree(id) {
    const targets = this.adjacency.get(id);
    return targets ? targets.size : 0;
  }

  /**
   * Returns in-degree (number of incoming edges) of a node.
   * @param {string} id
   * @returns {number}
   */
  getInDegree(id) {
    const sources = this.inAdjacency.get(id);
    return sources ? sources.size : 0;
  }

  /**
   * Returns all valid connection edges in the graph.
   * @returns {object[]}
   */
  getEdges() {
    return [...this.edges];
  }

  /**
   * Returns all connection edges originating from a source node.
   * @param {string} id
   * @returns {object[]}
   */
  getEdgesFrom(id) {
    return [...(this.edgesBySource.get(id) || [])];
  }

  /**
   * Returns all connection edges ending at a target node.
   * @param {string} id
   * @returns {object[]}
   */
  getEdgesTo(id) {
    return [...(this.edgesByTarget.get(id) || [])];
  }

  /**
   * Total number of valid edges in the graph.
   * @returns {number}
   */
  get edgeCount() {
    return this.edges.length;
  }

  /**
   * Indicates whether the graph was constructed from completely valid input
   * without any duplicate components, duplicate connections, or dangling connection references.
   * @returns {boolean}
   */
  get isValid() {
    return (
      this.duplicateComponentIds.length === 0 &&
      this.duplicateConnectionIds.length === 0 &&
      this.danglingConnections.length === 0
    );
  }

  /**
   * Diagnostics summary detailing input validity and any excluded or duplicate elements.
   * Callers must inspect this or `isValid` before treating operations on the graph as proof
   * of the original Blueprint's validity.
   * @returns {object}
   */
  get diagnostics() {
    return {
      isValid: this.isValid,
      duplicateComponentIds: [...this.duplicateComponentIds],
      duplicateConnectionIds: [...this.duplicateConnectionIds],
      danglingConnections: [...this.danglingConnections],
      missingReferences: [...this.missingReferences]
    };
  }

  /**
   * Serializes the graph's outgoing relationships to a plain adjacency dictionary.
   * @returns {Object.<string, string[]>}
   */
  toAdjacencyList() {
    const adj = {};
    for (const [id, targets] of this.adjacency.entries()) {
      adj[id] = Array.from(targets).sort();
    }
    return adj;
  }
}

/**
 * Factory function to construct a LogicalGraph from a Blueprint or component/connection arrays.
 * 
 * Safely isolates invalid input (dangling edges, duplicate component IDs) without crashing.
 * The returned graph exposes `graph.isValid` and `graph.diagnostics` so callers can
 * differentiate clean graphs from graphs built after filtering invalid elements.
 * 
 * @param {object|Array} blueprintOrComponents - Canonical Blueprint or components array
 * @param {Array} [optionalConnections] - Connections array if first argument is components array
 * @returns {LogicalGraph}
 */
function buildGraph(blueprintOrComponents, optionalConnections) {
  if (blueprintOrComponents instanceof LogicalGraph) {
    return blueprintOrComponents;
  }

  const validation = validateConnectionReferences(blueprintOrComponents, optionalConnections);

  let components = [];
  let connections = [];

  if (Array.isArray(blueprintOrComponents)) {
    components = blueprintOrComponents;
    connections = Array.isArray(optionalConnections) ? optionalConnections : [];
  } else if (blueprintOrComponents && typeof blueprintOrComponents === 'object') {
    components = Array.isArray(blueprintOrComponents.components) ? blueprintOrComponents.components : [];
    connections = Array.isArray(blueprintOrComponents.connections) ? blueprintOrComponents.connections : [];
  }

  const graph = new LogicalGraph();

  // Populate nodes
  for (const comp of components) {
    if (comp) {
      graph.addNode(comp);
    }
  }

  // Populate edges
  for (const conn of connections) {
    if (conn) {
      graph.addEdge(conn);
    }
  }

  // Merge validation findings so graph diagnostics reflect all input issues
  for (const dupComp of validation.duplicateComponentIds) {
    if (!graph.duplicateComponentIds.includes(dupComp)) {
      graph.duplicateComponentIds.push(dupComp);
    }
  }
  for (const dupConn of validation.duplicateConnectionIds) {
    if (!graph.duplicateConnectionIds.includes(dupConn)) {
      graph.duplicateConnectionIds.push(dupConn);
    }
  }

  return graph;
}

module.exports = {
  LogicalGraph,
  buildGraph
};
