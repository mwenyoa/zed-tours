const express = require("express");
// create express router
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersStatics,
} = require("../controllers/usersController");
const { SignUp, SignIn } = require('./../controllers/authController');

// define user auth routes
 router.post('/signup', SignUp);
 router.post('/login', SignIn);
// define users routes
router.route('/users-stats').get(getUsersStatics)
router.route('/').get(getUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;


