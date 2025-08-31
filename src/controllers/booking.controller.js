const Booking = require('../../src/models/bookingModel');
const Car = require('../../src/models/carsModel');
const logger = require('../config/logger');
const { addBookingService, getBookingService } = require('../services/booking.service');

const addBooking = async (req, res, next) => {
  try {
    const result = await addBookingService(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const { status, from, to } = req.query;
    const user = req.user;
    const filter = {};
    if (status) filter.status = status;

    if (from) filter.from = new Date(from);
    if (to) filter.to = new Date(to);

    const result = await getBookingService(user, filter);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const confirmBooking = async (req, res) => {
  const { payload, event } = req.body;
  try {
    if (event === 'payment.captured') {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.order_id;

      const booking = await Booking.findOne({ razorpayOrderId: orderId });

      if (!booking) {
        return res.status(200).json({ success: false, message: 'Booking not found for the car' });
      }

      // if (booking.paymentVerified) {
      //   return res.status(200).json({ msg: 'Booking already confirmed' });
      // }

      booking.status = 'confirmed';
      booking.razorpayPaymentId = paymentId;
      booking.paymentVerified = true;
      await booking.save();

      const car = await Car.findById(booking.car);
      car.bookedTimeSlots.push(booking.bookedTimeSlots);
      await car.save();
      // Optional: Prevent double booking
      // const conflict = car.bookedTimeSlots.some(
      //   (slot) => slot.from < booking.bookedTimeSlots.to && slot.to > booking.bookedTimeSlots.from
      // );
      // if (!conflict) {
      //   car.bookedTimeSlots.push(booking.bookedTimeSlots);
      //   await car.save();
      // }

      return res.status(200).json({ success: true, message: 'Booking confirmed successfully' });
    }
    res.status(200).json({ success: true, message: 'Event ignored' });
  } catch (e) {
    logger.error(e || e.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  addBooking,
  getBooking,
  confirmBooking
};
