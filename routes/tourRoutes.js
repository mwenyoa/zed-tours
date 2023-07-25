const express = require("express");
const router = express.Router();
const {
  getTour,
  getTours,
  createTour,
  deleteTour,
  updateTour,
  tourStats
} = require("../controllers/toursController");
// runing middleware for specific request routes
// router.param('id', checkBody); 
router.route("/").get(getTours).post(createTour); 
router.route("/statistics").get(tourStats);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);
// export router as dea
module.exports = router;
