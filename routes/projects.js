const express = require('express');
const {
  getProject,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  projectPhotoUpload
} = require('../controllers/projects');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.js');

router.route('/:id/photo').put(protect,authorize('publisher','admin'), projectPhotoUpload);

router
  .route('/')
  .get(getProjects)
  .post(protect,authorize('publisher','admin'),createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect,authorize('publisher','admin'), updateProject)
  .delete(protect,authorize('publisher','admin'), deleteProject);

module.exports = router;
