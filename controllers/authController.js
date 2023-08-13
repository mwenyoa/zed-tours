const { promisify } = require("node:util");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsyncError = require("./../utilities/catchAsyncError");
const AppError = require("./../utilities/AppError");
const sendMail = require("./../utilities/Mailer");

// Sign User token
const signToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ========== Register User =============
exports.SignUp = catchAsyncError(async (req, res, next) => {
  // securely create user with needed fields
  const { username, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    role
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

// ========== Log In User  =============
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

// ============= Authentication Middleware =============
exports.LoginVerification = catchAsyncError(async (req, res, next) => {
  // check if token is present in the request headers object
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in to view the requested page", 401)
    );
  }
  // return decoded token by verifying the token
  const verifiedToken = await promisify(JWT.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  if (!verifiedToken) {
    return next(new AppError("Invalid token. please login again", 401));
  }
  // check if payload has a db record
  const user = await User.findById(verifiedToken.id);
  if (!user) {
    return next(
      new AppError(
        "User account does not exist. Create an account and login  to have access",
        401
      )
    );
  }
  // check if the user has changed password after been issued a token
  if (user.passwordChangedAfterTokenIssue(verifiedToken.iat)) {
    return next(
      new AppError("Passaword was recently changed, please login again", 401)
    );
  }

  //  Grant acess if user has been properly authenticated ;
  req.user = user;
  next();
});

// permit user to perform actions based on roles

exports.AuthorizeUser = (...usersRoles) => {
  return (req, res, next) => {
    if (!usersRoles.includes(req.user.role)) {
      return next(
        new AppError("You don't have rights to perform this action", 403)
      );
    }
    next();
  };
};

// ================== Forgot and Reset Password handlers =============

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  // get email from user
  const userRecord = await User.findOne({ email: req.body.email });
  if (!userRecord) {
    return next(new AppError("No account found with that email address", 404));
  }
  // Generate a random password reset token
  const resetToken = userRecord.resetPasswordToken();
  await userRecord.save({ validateBeforeSave: false });

  // send password reset token to the users email
  const requestURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/${resetToken}`;

  const message = `Forgot your password?, 
    click on the link below to reset your password ${requestURL}, Or if you did not  forget your passwword, ignore this email.`;

  const subject = "Reset Forgot Password";
  try {
    await sendMail({
      email: req.body.email,
      subject: subject,
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "Forgot password reset link has been sent to your email.",
    });
  } catch (err) {
    next(
      new AppError("Unenable to send reset token email, please try again later")
    );
  }
});

// Reset Passwrod
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // get user token and encrypt it
  const passwordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //  retrieve user info based on the encrypted token
  const user = await User.findOne({
    passwordResetToken: passwordToken,
    passwordTokenExpires: { $gt: Date.now() },
  });
  // check if user record with that token is found
  if (!user) {
    return next(
      new AppError("Invalid forgot password token or has expired", 400)
    );
  }
  // create new password for the user and update the passwordChangedAt field
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordTokenExpires = undefined;

  await user.save();
  // Login User in to the system by issuing jwt token
  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});
