const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  tourname: {
    type: String,
    trim: true,
    required: [true, "Tour must have a name"],
    unique: [true, "Tour name must be unique"],
    minlength: [8, "Tour name must be less than 8 characters"],
    maxlength: [25, "Tour name must be more than 25 characters"],
  },
    city: {
      type: String,
      required: [true, "Tour city is required"],
    },
  price: {
    type: Number,
    required: [true, "Tour should be priced!"],
    min: [5, "Tour minimum price must 5 dollars"],
  },
  duration: {
    type: Number,
    required: [true, "Tour duration must be indicated!"],
    min: [1, "Minimum tour duration must be one day"],
  },
  tourDates: {
    type: Date,
    required: [true, "Enter tour available dates"]
  },
  rating: {
    type: Number,
    default: 3.0,
    min: [1, "Minimum tour rating must be 1"],
    max: [5, "maximum tour rating must be 5"],
  },
  averageRating: {
    type: Number,
    default: 0.0,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
  shortDescription: {
    type: String,
    required: [true, "Tour must have a brief description"],
    trim: true,
    minlength: [
      10,
      "Tour short description must not be less than 10 characters",
    ],
    maxlength: [
      30,
      "Tour short description must not be more than 30 characters",
    ],
  },
  description: {
    type: String,
    required: [true, "Tour must have a description"],
    trim: true,
    minlength: [100, "Tour  description must not be less than 100 characters"],
    maxlength: [500, "Tour  description must not be more than 50 characters"],
  },
  images: [String],
  bgImage: {
    type: String,
    // required: [true, "Tour must have a background cover image"],
  },
  maxTourSize: {
    type: Number,
    required: [true, "Tourist maximum number must be specified"],
  },
  tourType: {
    type: String,
    required: [true, "Tour type must be specified!"],
    emum: {
      values: ["Easy", "Difficult"],
      message: "Tour type must either be Easy or Diffcult",
    },
  },
  discount: {
    type: Number,
  },
  slug: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
});

tourSchema.pre("save", function(next){
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Tour", tourSchema);
