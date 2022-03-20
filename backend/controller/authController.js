const asyncHandler = require('express-async-handler');

const ErrorResponse = require('../utils/errorResponse');

const User = require('../model/userModel');
// const { success } = require('concurrently/src/defaults');

// @desc POST register user
// @routes /api/v1/auth/register
// access Public
exports.register = asyncHandler( async(req, res, next) => {

    const {name, email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400))
    }

    const user  = await User.create({name, email, password})

    // if (!user) {
    //     return next(new ErrorResponse('Invalid credentials', 401))
    // }

    // const isPasswordMatching = await user.comparePasswords(password);

    // if (!isPasswordMatching) {
    //     return next(new ErrorResponse('Invalid credentials', 401))
    // }

    // res.status(200).json(
    //     {
    //         success: true,
    //         user
    //     }
    // )

    sendTokens(user, 200, res)
})

// @desc POST login user
// @routes /api/v1/auth/login
// access Public
exports.login = asyncHandler( async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400))
    }

    const user  = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    const isPasswordMatching = await user.comparePasswords(password);

    if (!isPasswordMatching) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // res.status(200).json(
    //     {
    //         success: true,
    //         user
    //     }
    // )

    sendTokens(user, 200, res)
})

// @desc Get user Profile
// @Routes /api/v1/auth/profile
// access Private 
exports.getProfile = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.user._id);

    if(!user){
       return next(new ErrorResponse('Invalid credentials', 401))
    }

    // res.status(200).json({
    //   status: "success",
    //   user
    // });

    sendTokens(user, 200, res)
})

// @desc  update user Profile
// @Routes PUT /api/v1/auth/profile
// access Private 
exports.updateProfile = asyncHandler( async(req, res, next) => {
    let updatedUser;
    
    const user = await User.findById(req.user._id);

    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    if(req.body) {
        user.name = req.body.name || user.name;

        user.email = req.body.email || user.email;

        if(req.body.password) {
            user.password = req.body.password;
        }

        updatedUser = await user.save();
    }

    sendTokens(updatedUser, 201, res)
})

// @desc Get All Users
// @routes GET /api/v1/auth/users
// access Private
exports.getAllUsers = asyncHandler( async(req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        users
    })
})

// @desc DELETE  Users
// @routes GET /api/v1/auth/users/delete/:id
// access Private/Admin
exports.deleteUser = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorResponse("User not found", 404))
    }

    await user.remove();

    res.json({
        message: 'User successfully deleted'
    })
})

// @desc DELETE  Users
// @routes GET /api/v1/auth/users/:id
// access Private/Admin
exports.getUserById = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorResponse("User not found", 404))
    }

    res.json(user)
})



// @desc  update user 
// @Routes PUT /api/v1/auth/users/:id
// access Private/Admin
exports.updateUser = asyncHandler( async(req, res, next) => {
    let updatedUser;
    
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorResponse('User not found', 404))
    }

    if(req.body) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin

        updatedUser = await user.save();
    }

    sendTokens(updatedUser, 201, res)
})

const sendTokens = (user, statusCode, res) => {
    const token = user.getJWT();

    const userInfo = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    };

    res.status(statusCode).json({
        success: true,
        token,
        userInfo
    })
}