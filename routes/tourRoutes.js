const express = require("express");
const router = express.Router();
const {
  getTour,
  getTours,
  createTour,
  deleteTour,
  updateTour,
  tourStats,
  topCheapTours,
} = require("../controllers/toursController");
const {
  LoginVerification,
  AuthorizeUser,
} = require("./../controllers/authController");

router.route("/top-cheap-tours").get(topCheapTours, getTours);
router.route("/").get(LoginVerification, getTours).post(createTour);
router
  .route("/:id")
  .get(getTour, LoginVerification)
  .patch(LoginVerification, AuthorizeUser('tourguider', 'admin'), updateTour)
  .delete(LoginVerification, AuthorizeUser('tourguider', 'admin'), deleteTour);
router.route("/statistics").get(tourStats);

module.exports = router;
