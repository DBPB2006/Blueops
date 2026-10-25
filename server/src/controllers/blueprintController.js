const Project = require('../models/Project');
const BlueprintService = require('../services/BlueprintService');
const ApiError = require('../utils/ApiError');

// @desc    Get blueprint for a project
// @route   GET /api/projects/:projectId/blueprint
// @access  Private
exports.getBlueprint = async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, `Project not found with id of ${projectId}`);
  }
  if (project.owner.toString() !== req.user.id) {
    throw new ApiError(401, 'Not authorized to access this project');
  }

  const blueprint = await BlueprintService.getBlueprintByProjectId(projectId);
  if (!blueprint) {
    throw new ApiError(404, `Blueprint not found for project ${projectId}`);
  }

  res.status(200).json({
    success: true,
    message: 'Blueprint retrieved',
    data: blueprint
  });
};

// @desc    Update blueprint for a project
// @route   PATCH /api/projects/:projectId/blueprint
// @access  Private
exports.updateBlueprint = async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, `Project not found with id of ${projectId}`);
  }
  if (project.owner.toString() !== req.user.id) {
    throw new ApiError(401, 'Not authorized to update this project');
  }

  const blueprint = await BlueprintService.updateBlueprint(projectId, req.body);
  if (!blueprint) {
    throw new ApiError(404, `Blueprint not found for project ${projectId}`);
  }

  res.status(200).json({
    success: true,
    message: 'Blueprint updated',
    data: blueprint
  });
};
