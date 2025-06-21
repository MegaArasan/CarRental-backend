const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    car: {type: mongoose.Schema.Types.ObjectID, ref: "cars"},
    user: {type: mongoose.Schema.Types.ObjectID, ref: "users"},
    bookedTimeSlots: {
      from: {type: String},
      to: {type: String},
    },
    totalHours: {type: Number},
    totalAmount: {type: Number},
    // transactionId: { type: String },
    driverRequired: {type: Boolean},

    // New fields below
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    razorpayOrderId: {type: String},
    razorpayPaymentId: {type: String},
    paymentVerified: {type: Boolean, default: false},

    // Optional: auto-expiry handling
    expiresAt: {type: Date},
  },
  {timestamps: true}
);

const bookingModel = mongoose.model("bookings", bookingSchema);

module.exports = bookingModel;
