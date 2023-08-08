const express = require("express");
const router = express.Router();
const {
  getTour,
  getTours,
  createTour,
  deleteTour,
  updateTour,
  tourStats,
  topCheapTours
} = require("../controllers/toursController");

router.route("/top-cheap-tours").get(topCheapTours, getTours);
router.route("/").get(getTours).post(createTour); 
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);
router.route("/statistics").get(tourStats);

module.exports = router;