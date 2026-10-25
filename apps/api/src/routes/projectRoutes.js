const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Include other resource routers
const blueprintRouter = require('./blueprintRoutes');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Re-route into other resource routers
router.use('/:projectId/blueprint', blueprintRouter);

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .patch(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
