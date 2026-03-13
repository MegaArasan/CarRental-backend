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

    // 👇 Support for specific cars or all cars
    carIds: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
    isGlobal: { type: Boolean, default: false },

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
