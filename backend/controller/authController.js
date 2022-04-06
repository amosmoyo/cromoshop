const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

const jwt = require("jsonwebtoken");

const User = require("../model/userModel");

const bcrypt = require("bcryptjs");

const sendEmail = require("../utils/sendEmails");

const fetch = require('node-fetch');

const {google} = require('googleapis');

const {OAuth2} = google.auth

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);
// const { success } = require('concurrently/src/defaults');

// @desc POST register user
// @routes /api/v1/auth/register
// access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  // const isUser = await User.findOne({email});

  // if(isUser) {
  //    return  res.status(400).json({
  //         message: 'The user already exist'
  //     })
  // }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = {
    name,
    email,
    password: passwordHash,
  };

  const activation_token = createActivationToken(user);

  console.log(activation_token);

  const url = `${process.env.CLIENT_URL}/user/auth/activation/${activation_token}`;

  sendEmail(email, url, "verify your email address");

  // const user  = await User.create({name, email, password})

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

  // sendTokens(user, 200, res)

  res.status(201).json({
    success: true,
    message:
      "You have successful registered your account, go to your email and verify your email.",
  });
});

// @desc  POST activation email
// @routes /api/v1/auth/activation
// @access Public
exports.activationEmail = asyncHandler(async (req, res, next) => {
  const { activation_token } = req.body;

  const user = jwt.verify(
    activation_token,
    process.env.ACTIVATION_TOKEN_SECRETE
  );

  const { email, name, password } = user;

  const checkUser = await User.findOne({ email });

  if (checkUser) {
    return res.status(400).json({
      message: "The user already exist",
    });
  }

  const newUser = new User({
    email,
    name,
    password,
  });

  await newUser.save();

  res.status(200).json({
    message: "Your account has been activated",
  });
});

// @desc POST login user
// @routes /api/v1/auth/login
// access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  const checkUser = await User.findOne({ email }).select("+password");

  if (!checkUser) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isPasswordMatching = await bcrypt.compare(password, checkUser.password);

  if (!isPasswordMatching) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const refresh_token = createRefreshToken({ id: checkUser._id });

  // res.status(200).json(
  //     {
  //         success: true,
  //         user
  //     }
  // )

  // sendTokens(user, 200, res)

  res.status(200).cookie("refreshtoken", refresh_token, {
    httpOnly: true,
    path: "/api/v1/auth/refresh_token",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: false,
  });

  console.log(req.cookies, 12);

  res.json({
    message: "Login success",
  });
});

exports.getAccessToken = asyncHandler(async (req, res, next) => {
  const rf_token = req.cookies.refreshtoken;

  if (!rf_token) {
    return res.status(400).json({
      message: "Login now!",
    });
  }

  let token = "";
  let userId = "";

  jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRETE, (err, user) => {
    if (err) {
      return res.status(400).json({
        message: "Login now!",
      });
    }

    const access_token = createAccessToken({ id: user.id });

    token = access_token;
    userId = user.id;
  });

  const userData = await User.findOne({ _id: userId });

  sendTokens(token, userData, 200, res);
});

// @desc POST login user
// @routes /api/v1/auth/forgetpassword
// access Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const access_token = createAccessToken({ id: user._id });

    const url = `${process.env.CLIENT_URL}/user/reset/${access_token}`;

    sendEmail(email, url, "Reset your password");

    res.json({
      message: "Please CHECK YOUR EMAIL to RESET your password",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// @desc POST login user
// @routes /api/v1/auth/resetpassword
// access Public
exports.resetPassword = async (req, res, next) => {
  try {
    const password = req.body.password;

    const passwordHash = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: passwordHash,
      }
    );

    res.json({ message: "Password successfully changed!" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// @desc POSt Login
// @Routes /api/v1/auth/googleLogin
// access Public
exports.googleLogin = async (req, res, next) => {
  try {
    const {tokenId} = req.body;

    const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID});

    const {email, email_verified, picture, name} = verify.payload;

    if(!email_verified) {
      return res.status(400).json({
        message: "Email not verified"
      })
    }

    const password = email + process.env.GOOGLE_SECRET;

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findOne({email}).select("+password");

    if(user) {
      const isPassMatching = await bcrypt.compare(password, user.password);

      if (!isPassMatching) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      const refresh_token = createRefreshToken({ id: user._id });

      res.status(200).cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false
      });
  
      res.json({ message: "Login success!" });
    } else {
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        avatar: picture
      });

      await newUser.save();

      const refresh_token = createRefreshToken({ id: newUser._id });

      res.status(200).cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false
      });
  
      res.json({ message: "Login success!" });

    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


// @desc Get user Profile
// @Routes /api/v1/auth/facebookLogin
// access Public
exports.facebookLogin = async (req, res, next) => {
  try {
    const {accessToken, userID} = req.body

    const URL = `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;

    const data = await fetch(URL).then(res => res.json()).then(res => {return res})

    const {email, name, picture} = data


    // const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID});

    // const {email, email_verified, picture, name} = verify.payload;

    // if(!email_verified) {
    //   return res.status(400).json({
    //     message: "Email not verified"
    //   })
    // }

    const password = email + process.env.FACEBOOK_SECRET;

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findOne({email}).select('+password');

    if(user) {
      const isPassMatching = await bcrypt.compare(password, user.password);

      if (!isPassMatching) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      const refresh_token = createRefreshToken({ id: user._id });

      res.status(200).cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false
      });
  
      res.json({ message: "Login success!" });
    } else {
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        avatar: picture.data.url
      });

      await newUser.save();

      const refresh_token = createRefreshToken({ id: newUser._id });

      res.status(200).cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false
      });
  
      res.json({ message: "Login success!" });

    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// @desc Get user Profile
// @Routes /api/v1/auth/profile
// access Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // res.status(200).json({
  //   status: "success",
  //   user
  // });

  sendTokens(user, 200, res);
});

// @desc  update user Profile
// @Routes PUT /api/v1/auth/profile
// access Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  let updatedUser;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  if (req.body) {
    user.name = req.body.name || user.name;

    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    updatedUser = await user.save();
  }

  sendTokens(updatedUser, 201, res);
});

// @desc Get All Users
// @routes GET /api/v1/auth/users
// access Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    users,
  });
});

// @desc DELETE  Users
// @routes GET /api/v1/auth/users/delete/:id
// access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  await user.remove();

  res.json({
    message: "User successfully deleted",
  });
});

// @desc DELETE  Users
// @routes GET /api/v1/auth/users/:id
// access Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.json(user);
});

// @desc  update user
// @Routes PUT /api/v1/auth/users/:id
// access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let updatedUser;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  if (req.body) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    updatedUser = await user.save();
  }

  sendTokens(updatedUser, 201, res);
});

const sendTokens = (access_token, userData, statusCode, res) => {
  // const token = user.getJWT();

  const userInfo = {
    name: userData.name,
    email: userData.email,
    isAdmin: userData.isAdmin,
  };

  res.status(statusCode).json({
    success: true,
    token: access_token,
    userInfo,
  });
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRETE, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRETE, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRETE, {
    expiresIn: "7d",
  });
};
