const User = require("./../models/userModel");
const {filterQuery, sortQuery, limitQuery} = require('./../utils');

exports.getUsers = async (req, res) => {
  try {  
    let queryStr = filterQuery(req);
    queryStr  =  User.find(queryStr);
    queryStr = sortQuery(req, queryStr);
    queryStr = limitQuery(req, queryStr)
    const users = await queryStr;;
    res.status(200).json({
      status: "Success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(204).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
   await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      meesage: err.message,
    });
  }
};
