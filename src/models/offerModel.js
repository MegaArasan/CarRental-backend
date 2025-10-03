const { Schema, model } = require('mongoose');

const offerSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: { type: String },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    discountValue: { type: Number, required: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car', default: null },
    minDays: { type: Number, default: 0 },
    promoCode: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const offerModel = model('Offer', offerSchema);
module.exports = offerModel;
