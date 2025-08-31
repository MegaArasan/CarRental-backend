const ErrorResponse = require('../errors/errorResponse');
const Booking = require('../../src/models/bookingModel');
const Car = require('../../src/models/carsModel');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const moment = require('moment');
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET
});

const addBookingService = async (data) => {
  const options = {
    amount: data.totalAmount * 100,
    currency: 'INR',
    receipt: shortid.generate()
  };

  // Check the car exist
  const car = await Car.findOne({ _id: data.car });
  if (!car) {
    throw new ErrorResponse(404, 'Car not found');
  }

  const booking = await Booking.find({ car: data.car });

  // validate the dates
  const newbookingslot = data.bookedTimeSlots;
  const FORMAT = 'MMM DD YYYY HH:mm';
  const newFrom = moment(newbookingslot.from, FORMAT, true);
  const newTo = moment(newbookingslot.to, FORMAT, true);

  if (!newFrom.isValid() || !newTo.isValid()) {
    throw new ErrorResponse(400, `Invalid date/time format. Expected: ${FORMAT}`);
  }

  // Need to validate the given date is not a past date
  const currDate = moment();
  if (newFrom.isBefore(currDate)) {
    throw new ErrorResponse(400, 'From date should be greater than current time');
  }
  if (newTo.isSameOrBefore(newFrom)) {
    throw new ErrorResponse(400, 'To date should be greater than From date');
  }

  // Check for booking time slots
  const bookedslots = booking || [];

  for (const slot of bookedslots) {
    const existFrom = moment(slot.slot.from);
    const existTo = moment(slot.slot.to);

    let alreadyBooked = newFrom.isBefore(existTo) && newTo.isAfter(existFrom);
    if (alreadyBooked) {
      throw new ErrorResponse(400, 'Car is already booked in the selected time range');
    }
  }

  // create payment
  const response = await razorpay.orders.create(options);

  if (!response) {
    throw new ErrorResponse(500, 'Payment order creation failed');
  }

  //Save the booking
  const newbooking = new Booking({
    ...data,
    slot: {
      from: newFrom.toDate(),
      to: newTo.toDate()
    },
    razorpayOrderId: response.id,
    status: 'pending',
    expiresAt: moment().add(10, 'minutes').toDate()
  });
  await newbooking.save();

  return {
    id: response.id,
    currency: response.currency,
    amount: response.amount
  };
};

const getBookingService = async (user, filter = {}) => {
  let query = {};
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

module.exports = {
  addBookingService,
  getBookingService
};
