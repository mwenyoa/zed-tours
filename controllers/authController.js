const JWT = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsyncError = require("./../utilities/catchAsyncError");
const AppError = require("./../utilities/Error");

// Sign User token
const signToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Regiater User
exports.SignUp = catchAsyncError(async (req, res, next) => {
  // securely create user with needed fields
  const { username, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
  });

  if (!newUser) {
    return next(new AppError(`Erorr creating new user.`, 400));
  }
  // Issue token to user
  token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
    token,
  });
});

// Log In User
exports.SignIn = catchAsyncError(async (req, res, next) => {
  const { password, email } = req.body;
  // check for password or email presence
  if (!email || !password) {
    return next(new AppError("please enter email and password", 400));
  }
  // fetch user info
  const user = await User.findOne({ email }).select("+password");
  // verify if two user passwords match
  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError("Invalid email or password.", 401));
  }
  // Issue token to user
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});
