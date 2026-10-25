const Project = require('../models/Project');
const Blueprint = require('../models/Blueprint');
const ApiError = require('../utils/ApiError');

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  const projects = await Project.find({ owner: req.user.id });
  
  res.status(200).json({
    success: true,
    message: 'Projects retrieved',
    data: projects
  });
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, `Project not found with id of ${req.params.id}`);
  }

  // Make sure user is project owner
  if (project.owner.toString() !== req.user.id) {
    throw new ApiError(401, 'Not authorized to access this project');
  }

  res.status(200).json({
    success: true,
    message: 'Project retrieved',
    data: project
  });
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  req.body.owner = req.user.id;

  const project = await Project.create(req.body);

  // Automatically create an empty blueprint for this project
  await Blueprint.create({ projectId: project._id });

  res.status(201).json({
    success: true,
    message: 'Project created',
    data: project
  });
};

// @desc    Update project
// @route   PATCH /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, `Project not found with id of ${req.params.id}`);
  }

  if (project.owner.toString() !== req.user.id) {
    throw new ApiError(401, 'Not authorized to update this project');
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Project updated',
    data: project
  });
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, `Project not found with id of ${req.params.id}`);
  }

  if (project.owner.toString() !== req.user.id) {
    throw new ApiError(401, 'Not authorized to delete this project');
  }

  // Delete associated blueprint first
  await Blueprint.deleteOne({ projectId: project._id });
  
  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted',
    data: {}
  });
};
