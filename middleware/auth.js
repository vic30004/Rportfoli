const jwt = require('jsonwebtoken');
const asyncHandler= require('./async');
const errorResponse = require ('../utils/errorResponse.js');
const User = require('../models/user');

// Protect Routes

exports.protect = asyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    // Make sure token is exists

    if(!token){
        return next(new errorResponse('Not authorize to access this route', 401))
    }
        try {
            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decoded);

            req.user = await User.findById(decoded.id);
            
            next();
        } catch (err) {
            
        }

});

// Grant Access to Specific Role


exports.authorize =(...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new errorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
        }
        next();
    }
}