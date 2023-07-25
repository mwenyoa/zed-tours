const Tour = require('./../models/tourModel')

exports.toursListing = async (req, res, next) => {
    const tours = await Tour.find() ;
  res.status(200).render("tours", {
    title: "All Tours",
    tours
  });
  next()
};

exports.tourDetails = (req, res) => {
  res.status(200).render("tour", {
    title: "Tour Detail",
  });
};

exports.pageNotFound = (req, res) => {
  res.status(404).render("notfound", {
    title: "Not Found"
  })
}
