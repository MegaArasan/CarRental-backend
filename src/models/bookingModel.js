const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectID, ref: 'Car' },
    user: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    bookedTimeSlots: {
      _id: false,
      from: { type: Date, required: true },
      to: { type: Date, required: true }
    },
    totalHours: { type: Number },
    totalAmount: { type: Number },
    driverRequired: { type: Boolean, default: false },

    // New fields below
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentVerified: { type: Boolean, default: false },

    // Optional: auto-expiry handling
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

bookingSchema.index({ car: 1 });
bookingSchema.index({ user: 1 });
const bookingModel = mongoose.model('bookings', bookingSchema);

module.exports = bookingModel;
