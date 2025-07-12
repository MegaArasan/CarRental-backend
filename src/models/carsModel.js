const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, required: true },
    transmission: { type: String, required: true, enum: ['Manual', 'Automatic'] },
    segment: { type: String, required: true, enum: ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'MUV'] },
    capacity: { type: Number, required: true, min: 2, max: 10 },
    fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
    rentPerHour: { type: Number, required: true, min: 50 },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'FileAttachment', required: true },
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'FileAttachment' },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    location: {
      city: String,
      state: String,
      country: String
    }
  },
  { timestamps: true }
);

carSchema.index({ manufacturer: 1 });
carSchema.index({ segment: 1 });

const carModel = mongoose.model('Car', carSchema);
module.exports = carModel;
