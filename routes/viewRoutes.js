const express = require("express");

const router = express.Router();
const {
  toursListing,
  tourDetails,
  pageNotFound,
} = require("./../controllers/viewsController");

//root route
router.get("/", toursListing);
router.get("/tour/:id", tourDetails);
router.get("*", pageNotFound);

module.exports = router;
