const express = require('express');
const { getBlueprint, updateBlueprint } = require('../controllers/blueprintController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getBlueprint)
  .patch(protect, updateBlueprint);

module.exports = router;
