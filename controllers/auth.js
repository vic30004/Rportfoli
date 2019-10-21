const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/user');

// @desc       Register User
// @route      POST /api/v1/auth/register
// @access     Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create User

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // Create Token
  sendTokenResponse(user,200, res);
});

// @desc       login User
// @route      POST /api/v1/auth/login
// @access     Public
exports.login = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and Password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

//   Checl if password matchs
const isMatch = await user.matchPassword(password);

  if(!isMatch){
    return next(new ErrorResponse('Invalid Credentials', 401));
  }
  // Create Token
  sendTokenResponse(user,200, res);
});


// Get token from Model, create cookie and send response 

const sendTokenResponse = (user, statusCode,res)=>{
    // Create Token 

    const token =user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        sucess: true,
        token:token
    })
}


// @desc       Get current logged User
// @route      POST /api/v1/auth/me
// @access     Private

exports.getMe = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
})