const { promisify } = require("node:util");
const JWT = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsyncError = require("./../utilities/catchAsyncError");
const AppError = require("./../utilities/AppError");

// Sign User token
const signToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register User
exports.SignUp = catchAsyncError(async (req, res, next) => {
  // securely create user with needed fields
  const { username, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm
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

// LogIn status checker middleware
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
   return next(new AppError(
     "User account does not exist. Create an account and login  to have access", 401
   ));

 }
 // check if the user has changed password after been issued a token
  if(user.passwordChangedAfterTokenIssue(verifiedToken.iat)){
   return next(new AppError("Passaword was recently changed, please login again", 401));
  }

 //  Grant acess if user has been properly authenticated ;
  req.user = user;
  next();
});
