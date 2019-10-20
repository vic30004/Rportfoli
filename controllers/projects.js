const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Project = require('../models/Projects');
// @desc       Get all projects
// @route      Get /api/porfolio/project
// @access     Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  let query;
  
  let queryStr = JSON.stringify(req.query)

  queryStr = queryStr.replace(/\b(in)\b/g, match => `$${match}`)

  console.log(queryStr)
  
  query = Project.find(JSON.parse(queryStr))
  const projects = await query;
  res.status(200).json({ success: true, data: projects });
});

// @desc       Get a single projects
// @route      Get /api/porfolio/project/:id
// @access     Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: project });
});

// @desc       Create new project
// @route      POST /api/porfolio/project/:id
// @access     Private
exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc       Update Project
// @route      PUT /api/porfolio/project/:id
// @access     Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!project) {
    return res.status(400).json({
      success: false
    });
  }
  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc       Delete Project
// @route      delete /api/porfolio/project/:id
// @access     Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    res.status(404).json({
      success: false,
      data: {}
    });
  }
  res.status(201).json({
    success: true
  });
});
