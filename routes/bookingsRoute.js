const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carsModel");
//const cors = require("cors");
//router.use(cors());
const shortid = require("shortid");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: "rzp_test_wt6S48PF3wQ702",
  key_secret: "JO8zCupfZZMyhnTdo8ErPF9Z",
});

router.post("/bookcar", async (req, res) => {
  // console.log(req.body);
  const options = {
    amount: req.body.totalAmount * 100,
    currency: "INR",
    receipt: shortid.generate(),
  };
  try {
    const response = await razorpay.orders.create(options);
    console.log(response);

    if (!response) {
      return res.status(500).json({msg: "Payment order creation failed"});
    }

    const newbooking = new Booking(req.body);
    await newbooking.save();
    const car = await Car.findOne({_id: req.body.car});

    if (!car) {
      return res.status(404).json({msg: "Car not found"})
    }

    car.bookedTimeSlots.push(req.body.bookedTimeSlots);
    await car.save();

    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });

  } catch (error) {
    return res.status(500).json({msg: error.message || "Server error"});
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car");
    res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({msg: error.message || "Server error"});
  }
});

module.exports = router;
