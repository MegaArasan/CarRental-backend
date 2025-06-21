const Booking = require("../../src/models/bookingModel");
const Car = require("../../src/models/carsModel");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const moment = require("moment")

const razorpay = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
});


const addBooking = async (req, res, next) => {

    const options = {
        amount: req.body.totalAmount * 100,
        currency: "INR",
        receipt: shortid.generate(),
    };
    try {
//        Check the car exist
        const car = await Car.findOne({_id: req.body.car});

        if (!car) {
            return res.status(404).json({msg: "Car not found"})
        }

//        Check for booking time slots
        const bookedslots = car.bookedTimeSlots || [];
        const newbookingslot = req.body.bookedTimeSlots;
        const newFrom = moment((newbookingslot.from), "MMM DD YYYY");
        const newTo = moment((newbookingslot.to), "MMM DD YYYY");

        for (const slot of bookedslots) {

            const existFrom = moment((slot.from), "MMM DD YYYY");
            const existTo = moment((slot.to), "MMM DD YYYY");

            let alreadyBooked = newFrom.isBefore(existTo) && newTo.isAfter(existFrom)
            if (alreadyBooked) {
                return res.status(400).json({msg: "Car is already booked in the selected time range"})
            }
        }

// create payment
        const response = await razorpay.orders.create(options);

        if (!response) {
            return res.status(500).json({msg: "Payment order creation failed"});
        }

//Save the booking
        const newbooking = new Booking({
            ...req.body,
            razorpayOrderId: response.id,
            status: "pending",
            expiresAt: moment().add(10, "minutes").toDate()
        });
        await newbooking.save();

        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });

    } catch (error) {
        console.log(error)
        next(error.message);
    }
}

const getBooking = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate("car");
        res.status(200).json(bookings);
    } catch (error) {
        next(error.message);
    }
}

const confirmBooking = async (req, res) => {
    const {payload, event} = req.body;
    try {
        console.log(payload)
        if (event === "payment.captured") {
            const paymentId = payload.payment.entity.id;
            const orderId = payload.payment.entity.order_id;

            const booking = await Booking.findOne({razorpayOrderId: orderId});

            if (!booking) {
                return res.status(200).json({msg: "Booking not found for the car"})
            }

            booking.status = "confirmed";
            booking.razorpayPaymentId = paymentId;
            booking.paymentVerified = true;
            await booking.save();

            const car = await Car.findById(booking.car);
            car.bookedTimeSlots.push(booking.bookedTimeSlots);
            await car.save();


            return res.status(200).json({msg: "Booking confirmed successfully"});
        }
        res.status(200).json({msg: "Event ignored"});
    } catch (e) {
        console.log(e.message)
        res.status(500).json({msg: "Internal server error"});
    }
}

module.exports = {
    addBooking, getBooking, confirmBooking
}