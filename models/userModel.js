const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User should have a name"],
    minlength: [3, "Usename must not be less than 3 characters"],
    maxlength: [20, "Username must not be more than 20 characters"]
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "User email is already in use"],
    minlength: [10, "Email address must not be less than 10 characters"],
    maxlength: [40, "Email address must not be more than 40 characters"]
  },
  age: {
    type: Number,
    required: [true, "User age is required"],
    min: [10, "Minimum age required is 10"],
    max: [100, 'Maximum age limit is 100']
  },
  occupation: {
    type: String,
    required: [true, "User occupation should be specified"],
    minlength: [5, "User occupation must not be less than 5 characters"],
    maxlength: [25, "User occupation must not be more than 25 characters"]
  },
  created_at:{
    type: Date,
    default: Date.now()
  },
  updated_at:{
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("User", userSchema);


