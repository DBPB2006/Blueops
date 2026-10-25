/**
 * Centralized registry defining semantic edge types
 * for the BlueOps visual modeling platform.
 */
class EdgeRegistry {
  static edges = {
    dependsOn: {
      type: 'dependsOn',
      meaning: 'Startup ordering and generic dependency',
      color: '#64748b'
    },
    connectsTo: {
      type: 'connectsTo',
      meaning: 'Network communication',
      color: '#3b82f6'
    },
    communicatesWith: {
      type: 'communicatesWith',
      meaning: 'Bidirectional or asynchronous communication',
      color: '#8b5cf6'
    },
    mounts: {
      type: 'mounts',
      meaning: 'Persistent storage or volume mount',
      color: '#10b981'
    },
    uses: {
      type: 'uses',
      meaning: 'Generic dependency or utilization',
      color: '#f59e0b'
    },
    exposes: {
      type: 'exposes',
      meaning: 'Exposing a port or route',
      color: '#ef4444'
    },
    deploysTo: {
      type: 'deploysTo',
      meaning: 'Deployment target relationship',
      color: '#6366f1'
    }
  };

  static getEdgeDef(type) {
    return this.edges[type] || null;
  }
}

module.exports = EdgeRegistry;
