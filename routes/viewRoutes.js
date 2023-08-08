const express = require("express");
const router = express.Router();
const {
  toursListing,
  tourDetails,
} = require("./../controllers/viewsController");

//root route
router.get("/", toursListing);
router.get("/:id", tourDetails);

module.exports = router;
