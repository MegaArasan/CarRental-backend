const Booking = require('../../src/models/bookingModel');
const Car = require('../../src/models/carsModel');
const logger = require('../config/logger');
const {
  addBookingService,
  getBookingService,
  updateStatus
} = require('../services/booking.service');
const { updatePaymentHistory } = require('../services/payment.service');

const addBooking = async (req, res, next) => {
  try {
    const result = await addBookingService(req.body, req.user);
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
    if (status) {
      filter.status = status;
    }

    if (from) {
      filter.from = new Date(from);
    }
    if (to) {
      filter.to = new Date(to);
    }

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

      // Update PaymentHistory
      await updatePaymentHistory(orderId, {
        status: 'completed',
        paymentMode: '',
        gatewayResponse: JSON.stringify(req.body),
        transactionId: paymentId,
        amount: payload.payment.entity.amount
      });

      return res.status(200).json({ success: true, message: 'Booking confirmed successfully' });
    }
    res.status(200).json({ success: true, message: 'Event ignored' });
  } catch (e) {
    logger.error(e || e.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateStatus(id, status);

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: ''
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBooking,
  getBooking,
  confirmBooking,
  updateBookingStatus
};
