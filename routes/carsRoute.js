const express = require("express");
const router = express.Router();
const Car = require("../models/carsModel");

router.get("/getallcars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({msg: error.message || "Something went wrong"});
  }
});

module.exports = router;
