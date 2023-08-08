const express = require("express");
// create express router
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersStatics,
} = require("../controllers/usersController");

// define users routes
router.route('/users-stats').get(getUsersStatics)
router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;


