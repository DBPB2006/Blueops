const NodeRegistry = require('../blueprint/registries/NodeRegistry');
const EdgeRegistry = require('../blueprint/registries/EdgeRegistry');

class ValidationService {
  /**
   * Performs lightweight visual validation on the graph.
   * Returns warnings, errors, and suggestions.
   * Does NOT modify the graph.
   */
  static analyze(graph) {
    const analysis = {
      errors: [],
      warnings: [],
      suggestions: []
    };

    if (!graph || !graph.nodes || !graph.edges) {
      return analysis;
    }

    const nodes = graph.nodes;
    const edges = graph.edges;

    const hasFrontend = nodes.some(n => n.type === 'frontend');
    const hasBackend = nodes.some(n => n.type === 'backend');
    const hasDatabase = nodes.some(n => n.type === 'database');

    if (hasFrontend && !hasBackend && !nodes.some(n => n.type === 'gateway')) {
      analysis.warnings.push('Frontend node is present but not connected to any backend or gateway.');
    }

    if (hasBackend && !hasDatabase && !nodes.some(n => n.type === 'externalService')) {
      analysis.warnings.push('Backend node is present but no database or external service is connected.');
    }

    nodes.forEach(node => {
      if (!node.data || !node.data.name) {
        analysis.warnings.push(`Node of type ${node.type} (${node.id}) is missing a name.`);
      }

      if (!NodeRegistry.getNodeDef(node.type)) {
        analysis.errors.push(`Unknown node type: ${node.type}`);
      }
    });

    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) {
        analysis.errors.push(`Edge ${edge.id} references non-existent nodes.`);
        return;
      }

      const sourceDef = NodeRegistry.getNodeDef(sourceNode.type);
      const targetDef = NodeRegistry.getNodeDef(targetNode.type);

      if (sourceDef && targetDef) {
        if (sourceDef.allowedConnectionsOut.length > 0 && !sourceDef.allowedConnectionsOut.includes(targetNode.type)) {
          analysis.warnings.push(`${sourceDef.name} should typically not connect directly to ${targetDef.name}.`);
        }
      }
    });

    return analysis;
  }
}

module.exports = ValidationService;
