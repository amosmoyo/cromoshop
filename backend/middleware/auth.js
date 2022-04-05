const ErrorResponse = require("../utils/errorResponse");

const asyncHandler = require("express-async-handler");

const User = require("../model/userModel");

const jwt = require("jsonwebtoken");

exports.protect = asyncHandler( async(req, res, next) => {
    let token;

    console.log(req.headers.authorization.split(' ')[1])

    if (req.headers.authorization && (req.headers.authorization.split(' ')[0] === "Bearer" )) {
        token = req.headers.authorization.split(' ')[1];
    }



    if(!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE);
        
        req.user = await User.findById(decoded.id);


        next()
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401))
    }
})

exports.adminPrivilages = asyncHandler( async(req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        return next(new ErrorResponse("You are not an admin", 401) )
    }
})