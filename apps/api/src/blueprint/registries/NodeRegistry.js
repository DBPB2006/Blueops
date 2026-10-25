/**
 * Centralized registry defining allowed node types and their properties
 * for the BlueOps visual modeling platform.
 */
class NodeRegistry {
  static nodes = {
    frontend: {
      type: 'frontend',
      name: 'Frontend Application',
      allowedProperties: ['runtime', 'framework', 'buildCommand', 'publicUrl', 'replicas'],
      allowedConnectionsOut: ['backend', 'gateway', 'cdn'],
      allowedConnectionsIn: ['cdn', 'gateway']
    },
    backend: {
      type: 'backend',
      name: 'Backend API',
      allowedProperties: ['runtime', 'framework', 'port', 'envVars', 'cpu', 'memory', 'replicas', 'healthChecks'],
      allowedConnectionsOut: ['database', 'cache', 'queue', 'externalService', 'backend'],
      allowedConnectionsIn: ['frontend', 'gateway', 'backend', 'worker']
    },
    database: {
      type: 'database',
      name: 'Database',
      allowedProperties: ['engine', 'version', 'persistent', 'storage', 'port', 'volumes', 'secrets'],
      allowedConnectionsOut: [],
      allowedConnectionsIn: ['backend', 'worker']
    },
    cache: {
      type: 'cache',
      name: 'Cache',
      allowedProperties: ['engine', 'memory', 'persistent'],
      allowedConnectionsOut: [],
      allowedConnectionsIn: ['backend', 'worker']
    },
    queue: {
      type: 'queue',
      name: 'Message Queue',
      allowedProperties: ['engine', 'persistent'],
      allowedConnectionsOut: ['worker'],
      allowedConnectionsIn: ['backend']
    },
    worker: {
      type: 'worker',
      name: 'Background Worker',
      allowedProperties: ['runtime', 'framework', 'envVars', 'cpu', 'memory', 'replicas'],
      allowedConnectionsOut: ['database', 'cache', 'externalService'],
      allowedConnectionsIn: ['queue']
    },
    gateway: {
      type: 'gateway',
      name: 'API Gateway',
      allowedProperties: ['rules', 'port'],
      allowedConnectionsOut: ['frontend', 'backend'],
      allowedConnectionsIn: []
    },
    storage: {
      type: 'storage',
      name: 'Object Storage',
      allowedProperties: ['provider', 'bucketName', 'publicAccess'],
      allowedConnectionsOut: [],
      allowedConnectionsIn: ['backend', 'worker', 'frontend']
    },
    externalService: {
      type: 'externalService',
      name: 'External Service',
      allowedProperties: ['url', 'authType'],
      allowedConnectionsOut: [],
      allowedConnectionsIn: ['backend', 'worker']
    }
  };

  static getNodeDef(type) {
    return this.nodes[type] || null;
  }
  
  static getAllNodeTypes() {
    return Object.keys(this.nodes);
  }
}

module.exports = NodeRegistry;
