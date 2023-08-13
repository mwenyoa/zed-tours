const Tour = require("./../models/tourModel");
const {
  filterQuery,
  sortQuery,
  limitQuery,
  paginateQuery,
} = require("./../utilities/ApiFeatures");
const catchAsyncError = require("./../utilities/catchAsyncError");
const AppError = require("../utilities/AppError");

exports.topCheapTours = catchAsyncError(async (req, res, next) => {
  req.query.limit = "3";
  req.query.sort = "price";
  req.query.fields =
    "tourname, price, rating, averageRating, ratingsCount, shortDescription";
    next();
});

exports.getTours = catchAsyncError(async (req, res, next) => {
  let queryStr = filterQuery(req);
  queryStr = Tour.find(queryStr);
  queryStr = sortQuery(req, queryStr);
  queryStr = limitQuery(req, queryStr);
  queryStr = paginateQuery(req, queryStr, Tour);
  const tours = await queryStr;
  
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  const param = req.params.id;
  const tour = await Tour.findById(param);
  // generate an error if no tour found
  if (!tour) {
    return next(new AppError(`Tour with that ID,  was not found`, 404));
  }
  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: "Success",
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // generate an error if no tour found
  if (!tour) {
    return next(new AppError("Tour requested was not found", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  // generate an error if no tour found
  if (!tour) {
    return next(new AppError("Tour requested was not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: "Deleted successfully",
  });
});

// Tour Agg Pipeline
exports.tourStats = catchAsyncError(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        averageRating: { $gte: 4 },
      },
    },
    {
      $group: {
        _id: { $toUpper: "$tourType" },
        totalTours: { $sum: 1 },
        totalRatings: { $sum: "$ratingsCount" },
        averageRatings: { $avg: "$averageRating" },
        minumumPrice: { $min: "$price" },
        maximumPrice: { $max: "$price" },
        averagePrice: { $avg: "$price" },
      },
    },
    {
      $sort: { averagePrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
