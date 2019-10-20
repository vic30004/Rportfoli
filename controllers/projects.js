// @desc       Get all projects
// @route      Get /api/porfolio/project
// @access     Public
exports.getProjects = (req,res,next)=>{

    res.status(200).json({success: true, msg:'Show all Projects',hello:req.hello})
}

// @desc       Get a single projects
// @route      Get /api/porfolio/project/:id
// @access     Public
exports.getProject = (req,res,next)=>{
    res.status(200).json({success: true, msg:`Get project ${req.params.id}`})

}

// @desc       Create new project
// @route      POST /api/porfolio/project/:id
// @access     Private
exports.createProject = (req,res,next)=>{
    res.status(200).json({success: true, msg:'add new project'})

}

// @desc       Update Project
// @route      PUT /api/porfolio/project/:id
// @access     Private
exports.updateProject = (req,res,next)=>{
    res.status(200).json({success: true, msg:`Update project ${req.params.id}`})

}

// @desc       Delete Project
// @route      delete /api/porfolio/project/:id
// @access     Private
exports.deleteProject = (req,res,next)=>{
    res.status(200).json({success: true, msg:`Delete project ${req.params.id}`})

}