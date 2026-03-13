const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slot: {
      _id: false,
      from: { type: Date, required: true },
      to: { type: Date, required: true }
    },
    totalHours: { type: Number },
    totalAmount: { type: Number },
    driverRequired: { type: Boolean, default: false },

    // New fields for pickup & drop
    pickupLocation: {
      type: String,
      required: function () {
        return this.driverRequired;
      }
    },
    dropLocation: {
      type: String,
      required: function () {
        return this.driverRequired;
      }
    },
    pickupDate: {
      type: Date,
      required: function () {
        return this.driverRequired;
      }
    },
    dropDate: {
      type: Date,
      required: function () {
        return this.driverRequired;
      }
    },

    // Offer/discount fields
    offerApplied: { type: String, default: null },
    finalAmount: { type: Number }, // amount after applying discount

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
bookingSchema.index({ 'slot.from': 1, 'slot.to': 1 });
bookingSchema.index({ car: 1, 'slot.from': 1, 'slot.to': 1 }, { name: 'car_slot_check' });
bookingSchema.index({ status: 1 });

const bookingModel = mongoose.model('bookings', bookingSchema);

module.exports = bookingModel;
