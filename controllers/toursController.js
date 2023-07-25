const Tour = require("./../models/tourModel");
const {
  filterQuery,
  sortQuery,
  limitQuery,
  paginateQuery,
} = require("./../utils");

exports.getTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const param = req.params.id;
    const tour = await Tour.find({ _id: { $eq: `${param}` } });
    // or Tour.findById(param);
    res.status(200).json({
      status: "Success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(402).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: "Deleted successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Tour Agg Pipeline
exports.tourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
