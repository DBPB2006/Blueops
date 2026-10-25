/**
 * Connection Reference Validation
 * 
 * Verifies that all connection endpoints ('from' and 'to') in a Blueprint
 * reference valid, existing component IDs.
 * 
 * Returns clear, structured result objects rather than throwing or crashing.
 */

/**
 * Validates connection references in a blueprint, LogicalGraph, or raw components and connections.
 * 
 * @param {object|Array} blueprintOrComponents - Canonical Blueprint object, LogicalGraph, or array of components
 * @param {Array} [optionalConnections] - Array of connections if first arg is components array
 * @returns {object} Validation result { isValid, missingReferences, duplicateComponentIds, duplicateConnectionIds, errors }
 */
function validateConnectionReferences(blueprintOrComponents, optionalConnections) {
  let components = [];
  let connections = [];

  if (blueprintOrComponents && typeof blueprintOrComponents.getNodes === 'function') {
    components = blueprintOrComponents.getNodes();
    connections = typeof blueprintOrComponents.getEdges === 'function'
      ? [...blueprintOrComponents.getEdges(), ...(blueprintOrComponents.danglingConnections || [])]
      : [];
  } else if (Array.isArray(blueprintOrComponents)) {
    components = blueprintOrComponents;
    connections = Array.isArray(optionalConnections) ? optionalConnections : [];
  } else if (blueprintOrComponents && typeof blueprintOrComponents === 'object') {
    components = Array.isArray(blueprintOrComponents.components) ? blueprintOrComponents.components : [];
    connections = Array.isArray(blueprintOrComponents.connections) ? blueprintOrComponents.connections : [];
  }

  const missingReferences = [];
  const errors = [];

  // Track component IDs and detect duplicates or malformed component descriptors
  const componentIdSet = new Set();
  const duplicateComponentIds = [];
  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    if (!comp || (typeof comp !== 'object' && typeof comp !== 'string')) {
      errors.push(`Component at index ${i} is not a valid object or string ID`);
      continue;
    }

    const id = typeof comp === 'object' ? comp.id : comp;
    if (typeof id !== 'string' || id.trim() === '') {
      errors.push(`Component at index ${i} is missing a valid string 'id'`);
      continue;
    }

    if (componentIdSet.has(id)) {
      if (!duplicateComponentIds.includes(id)) {
        duplicateComponentIds.push(id);
      }
    } else {
      componentIdSet.add(id);
    }
  }

  // Track connection IDs and detect duplicates
  const connectionIdSet = new Set();
  const duplicateConnectionIds = [];
  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    if (conn && typeof conn === 'object' && conn.id) {
      if (connectionIdSet.has(conn.id)) {
        if (!duplicateConnectionIds.includes(conn.id)) {
          duplicateConnectionIds.push(conn.id);
        }
      } else {
        connectionIdSet.add(conn.id);
      }
    }
  }

  // Validate each connection's from and to endpoints
  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    if (!conn || typeof conn !== 'object') {
      const msg = `Connection at index ${i} is not a valid object`;
      errors.push(msg);
      missingReferences.push({
        connectionId: `index_${i}`,
        field: 'connection',
        referencedId: null,
        message: msg
      });
      continue;
    }

    const connId = conn.id || `conn_index_${i}`;
    const fromId = conn.from;
    const toId = conn.to;

    // Check 'from' reference
    if (typeof fromId !== 'string' || fromId.trim() === '') {
      const msg = `Connection '${connId}' is missing source endpoint 'from'`;
      errors.push(msg);
      missingReferences.push({
        connectionId: connId,
        field: 'from',
        referencedId: fromId,
        message: msg
      });
    } else if (!componentIdSet.has(fromId)) {
      const msg = `Connection '${connId}' references missing 'from' component '${fromId}'`;
      errors.push(msg);
      missingReferences.push({
        connectionId: connId,
        field: 'from',
        referencedId: fromId,
        message: msg
      });
    }

    // Check 'to' reference
    if (typeof toId !== 'string' || toId.trim() === '') {
      const msg = `Connection '${connId}' is missing target endpoint 'to'`;
      errors.push(msg);
      missingReferences.push({
        connectionId: connId,
        field: 'to',
        referencedId: toId,
        message: msg
      });
    } else if (!componentIdSet.has(toId)) {
      const msg = `Connection '${connId}' references missing 'to' component '${toId}'`;
      errors.push(msg);
      missingReferences.push({
        connectionId: connId,
        field: 'to',
        referencedId: toId,
        message: msg
      });
    }
  }

  if (duplicateComponentIds.length > 0) {
    errors.push(`Duplicate component IDs found: ${duplicateComponentIds.join(', ')}`);
  }
  if (duplicateConnectionIds.length > 0) {
    errors.push(`Duplicate connection IDs found: ${duplicateConnectionIds.join(', ')}`);
  }

  return {
    isValid: (
      missingReferences.length === 0 &&
      duplicateComponentIds.length === 0 &&
      duplicateConnectionIds.length === 0 &&
      errors.length === 0
    ),
    missingReferences,
    duplicateComponentIds,
    duplicateConnectionIds,
    errors
  };
}

module.exports = {
  validateConnectionReferences
};
