const { Schema, model } = require('mongoose');

const paymentSchema = new Schema(
  {
    orderId: { type: String, required: true },
    transactionId: { type: String, unique: true },
    status: { type: String, required: true, enum: ['pending', 'completed', 'failed'] },
    paymentMode: { type: String, enum: ['Card', 'UPI', 'NetBanking', 'Wallet'], required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paidAt: { type: Date },
    failedAt: { type: Date },
    gatewayResponse: { type: Schema.Types.Mixed },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    attempts: { type: Number, default: 1 },
    refundStatus: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending' }
  },
  { timestamps: true }
);

// Indexes
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ user: 1, orderId: 1 }, { unique: true });

// --- Helper function ---
function applyStatusTimestamps(update) {
  const u = update.$set || update;

  if (u.status === 'completed' && !u.paidAt) {
    u.paidAt = new Date();
  }
  if (u.status === 'failed' && !u.failedAt) {
    u.failedAt = new Date();
  }

  if (update.$set) {
    update.$set = u;
  } else {
    update = u;
  }

  return update;
}

// --- Hooks ---
paymentSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  let update = this.getUpdate();
  update = applyStatusTimestamps(update);
  this.setUpdate(update);

  // Extra rule for findOneAndUpdate (status regression guard)
  if (this.op === 'findOneAndUpdate') {
    const doc = await this.model.findOne(this.getQuery());
    if (doc?.status === 'completed' && update.status && update.status !== 'completed') {
      return next(new Error('Cannot change status from completed to another state'));
    }
  }

  next();
});

const paymentModel = model('Payment', paymentSchema);
module.exports = paymentModel;
