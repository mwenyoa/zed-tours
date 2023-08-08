const Tour = require('./../models/tourModel')
const AppError = require("./../utilities/Error");

exports.toursListing = async (req, res, next) => {
    const tours = await Tour.find() ;
  res.status(200).render("tours", {
    title: "All Tours",
    tours
  });
  next()
};

exports.tourDetails = async(req, res, next) => {
   const tour = Tour.findById(req.query.id);
  res.status(200).render("tour", {
    title: "Tour Detail",
    tour
  });
 return next()
};

exports.pageNotFound = (req, res, next) => {

  // res.status(404).render("notfound", {
  //   title: "Not Found",
  //   status: 'fail',
  //   error: `No resource exists for the url ${req.originalUrl}`
  // })
  next(new AppError(`No resource exists for the url ${req.originalUrl}`));
}
