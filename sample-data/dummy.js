const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const Tour = require("./../models/tourModel");

const DBS = process.env.DB_LOCAL;
mongoose
  .connect(DBS)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((e) => {
    throw new Error(e.message);
  });

// Read sample data into a variable
const Tours = JSON.parse(fs.readFileSync(`${__dirname}/sample.json`, "utf-8"));

// populate data
const Populate = async () => {
  try {
    await Tour.create(Tours);
    alert("Data population completed");
  } catch (err) {
    throw new Error(err.message);
  }
  process.exit(); 
};

const deleteDummy = async () => {
  try {
    await Tour.deleteMany();
    alert("Data deletion completed");
  } catch (err) {
    throw new Error(err.message);
  }
  process.exit();
};

if (process.argv[2] === "--populate") {
  Populate();
} else if (process.argv[2] === "--trash") {
  deleteDummy();
}
