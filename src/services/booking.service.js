const ErrorResponse = require('../errors/errorResponse');
const Booking = require('../../src/models/bookingModel');
const Car = require('../../src/models/carsModel');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const moment = require('moment');
const { insertPaymentHistory } = require('./payment.service');
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET
});

const addBookingService = async (data, user) => {
  const options = {
    amount: data.totalAmount * 100,
    currency: 'INR',
    receipt: shortid.generate()
  };

  // Check if car exists
  const car = await Car.findOne({ _id: data.car });
  if (!car) {
    throw new ErrorResponse(404, 'Car not found');
  }

  const bookings = await Booking.find({ car: data.car });

  // Validate slot dates
  const FORMAT = 'MMM DD YYYY HH:mm';
  const newFrom = moment(data.bookedTimeSlots.from, FORMAT, true);
  const newTo = moment(data.bookedTimeSlots.to, FORMAT, true);

  if (!newFrom.isValid() || !newTo.isValid()) {
    throw new ErrorResponse(400, `Invalid date/time format. Expected: ${FORMAT}`);
  }

  const currDate = moment();
  if (newFrom.isBefore(currDate)) {
    throw new ErrorResponse(400, 'From date should be greater than current time');
  }
  if (newTo.isSameOrBefore(newFrom)) {
    throw new ErrorResponse(400, 'To date should be greater than From date');
  }

  // Check for overlapping bookings
  for (const slot of bookings) {
    const existFrom = moment(slot.slot.from);
    const existTo = moment(slot.slot.to);

    if (newFrom.isBefore(existTo) && newTo.isAfter(existFrom)) {
      throw new ErrorResponse(400, 'Car is already booked in the selected time range');
    }
  }

  // Create Razorpay payment order
  const response = await razorpay.orders.create(options);

  if (!response) {
    throw new ErrorResponse(500, 'Payment order creation failed');
  }

  // Save booking with pickup/drop and optional offer
  const newBooking = new Booking({
    car: data.car,
    user: data.user._id,
    slot: { from: newFrom.toDate(), to: newTo.toDate() },
    totalHours: data.totalHours,
    totalAmount: data.totalAmount,
    finalAmount: data.finalAmount || data.totalAmount,
    driverRequired: data.driverRequired,
    offerApplied: data.offerApplied || null,

    // Pickup & Drop
    pickupLocation: data.pickupLocation,
    dropLocation: data.dropLocation,
    pickupDate: new Date(data.pickupDate),
    dropDate: new Date(data.dropDate),

    razorpayOrderId: response.id,
    status: 'pending',
    expiresAt: moment().add(10, 'minutes').toDate()
  });

  await newBooking.save();

  // Add payment history
  await insertPaymentHistory(response.id, user, data.totalAmount);

  return {
    id: response.id,
    currency: response.currency,
    amount: response.amount
  };
};

const getBookingService = async (user, filter = {}) => {
  const query = {};
  if (user.role !== 'admin') {
    query.user = user.userId;
  }

  if (filter['status']) {
    query.status = filter['status'];
  }

  if (filter.from || filter.to) {
    const slotFilter = {};
    if (filter.from && filter.to) {
      slotFilter.$or = [{ 'slot.from': { $lte: filter.from }, 'slot.to': { $gte: filter.to } }];
    } else if (filter.from) {
      slotFilter['slot.from'] = { $gte: filter.from };
    } else if (filter.to) {
      slotFilter['slot.to'] = { $lte: filter.to };
    }

    Object.assign(query, slotFilter);
  }
  console.log(query);
  const bookings = await Booking.find(query).populate('car');
  return bookings;
};

const updateStatus = async (id, status) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ErrorResponse(404, 'Booking not found');
  }

  booking.status = status;
  await booking.save();
  return true;
};

module.exports = {
  addBookingService,
  getBookingService,
  updateStatus
};
