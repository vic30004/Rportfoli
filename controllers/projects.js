const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Project = require('../models/Projects');
// @desc       Get all projects
// @route      Get /api/porfolio/project
// @access     Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  let query;

  // Copy query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  // create operators ($in)
  queryStr = queryStr.replace(/\b(in)\b/g, match => `$${match}`);

  // Finding resource
  query = Project.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query.select(fields);
  }

  // Sort

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
  } else {
    query = query.sort('-addOn');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Project.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const projects = await query;

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: projects.length,
    pagination,
    data: projects
  });
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
  project.remove();
  res.status(201).json({
    success: true
  });
});

// @desc       Upload Photo for Project
// @route      Put /api/porfolio/project/:id/photo
// @access     Private
exports.projectPhotoUpload = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 400)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(`Please upload an image file, such as(jpeg,png,svg)`),
      400
    );
  }

  // Check Filessize

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Image size can't be greater thatn ${process.env.MAX_FILE_UPLOAD}`
      )
    );
  }

  // Create customer filename

  file.name = `photo_${project._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file Upload`), 500);
    }

    await Project.findByIdAndUpdate(req.params.id, { picture: file.name });

    res.status(200).json({ sucess: true, data: file.name });
  });
});
