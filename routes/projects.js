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


router.route('/:id/photo').put(projectPhotoUpload)

router
  .route('/')
  .get(getProjects)
  .post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
