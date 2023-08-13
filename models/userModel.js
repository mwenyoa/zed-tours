const crypto = require("crypto");
const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");

// User Schema Modeling
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User should have a name"],
    minlength: [3, "Usename must not be less than 3 characters"],
    maxlength: [20, "Username must not be more than 20 characters"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "User email is already in use"],
    minlength: [10, "Email address must not be less than 10 characters"],
    maxlength: [40, "Email address must not be more than 40 characters"],
  },
  password: {
    type: String,
    required: [true, "User account should have a password"],
    minlength: [6, "User password must be 6 or more characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password Confirm field is required"],
    minlength: [6, "Password confirm must be 6 or more characters"],
    validate: {
      validator: function (passwconf) {
        return passwconf === this.password;
      },
      message: "Two passwords did not match",
    },
  },
  passwordResetToken: {
    type: String,
  },
  passwordTokenExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["user", "tourguider", "admin"],
    default: "user",
  },
  photo: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
  },
  occupation: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
});
// ===================== MIDDLEWARES ==================
// encrypt password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bycrpt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  } else {
    return next();
  }
});

// update password changed at field on password reset success 
userSchema.pre("save", async function (next) {
  if (this.isNew || !this.isModified("password")) return next();
    this.passwordChangedAt = Date.now() - 1000;
   next();
});

// ======================= INSTANCE METHODS =======================
//  compare passwords
userSchema.methods.comparePasswords = async function (
  userPaswword,
  dbPassword
) {
  return await bycrpt.compare(userPaswword, dbPassword);
};

// Check if user changed password after Token Issue
userSchema.methods.passwordChangedAfterTokenIssue = function (JWTIssuedAt) {
  if (this.passwordChangedAt) {
    const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changedAt > JWTIssuedAt;
  }
  return false;
};

// Forgot Password
userSchema.methods.resetPasswordToken = function () {
  resetToken = crypto.randomBytes(32).toString("hex");
  // create and update hash object
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // set password token expirely time in miliseconds
  this.passwordTokenExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
