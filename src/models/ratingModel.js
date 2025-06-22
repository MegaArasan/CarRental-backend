const { Schema, model } = require('mongoose');

const ratingSchema = new Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectID, ref: 'Car', required: true },
    user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    reviews: {
      type: String,
      required: true
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ratingSchema.index({ car: 1 });
ratingSchema.index({ user: 1 });
ratingSchema.index({ car: 1, user: 1 }, { unique: true });
const ratingModel = model('rating', ratingSchema);
module.exports = ratingModel;
