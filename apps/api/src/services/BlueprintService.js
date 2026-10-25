const Blueprint = require('../models/Blueprint');
const ValidationService = require('./ValidationService');

class BlueprintService {
  /**
   * Retrieves a blueprint by project ID.
   */
  static async getBlueprintByProjectId(projectId) {
    return await Blueprint.findOne({ projectId });
  }

  /**
   * Updates a blueprint and generates new analysis.
   */
  static async updateBlueprint(projectId, payload) {
    const blueprint = await Blueprint.findOne({ projectId });
    
    if (!blueprint) {
      return null;
    }

    if (payload.graph) {
      blueprint.graph = payload.graph;
    }
    if (payload.deploymentIntent) {
      blueprint.deploymentIntent = payload.deploymentIntent;
    }
    if (payload.metadata) {
      blueprint.metadata = payload.metadata;
    }

    // Run validation if graph was updated
    if (payload.graph) {
      const analysis = ValidationService.analyze(payload.graph);
      blueprint.analysis = analysis;
    } else if (payload.analysis) {
      blueprint.analysis = payload.analysis;
    }

    // Increment version
    blueprint.version += 1;

    await blueprint.save();
    return blueprint;
  }
}

module.exports = BlueprintService;
