import mongoose from 'mongoose';
import SUBSCRIPTION_STATUS  from '../utils/constant.js';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(SUBSCRIPTION_STATUS),
    default: SUBSCRIPTION_STATUS.ACTIVE
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  paymentHistory: [{
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success'
    }
  }]
}, {
  timestamps: true
});

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });
subscriptionSchema.index({ userId: 1, createdAt: -1 });

subscriptionSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date() && this.status === SUBSCRIPTION_STATUS.ACTIVE;
});

subscriptionSchema.methods.checkAndUpdateExpiry = async function() {
  if (this.isExpired) {
    this.status = SUBSCRIPTION_STATUS.EXPIRED;
    await this.save();
    return true;
  }
  return false;
};
subscriptionSchema.pre(/^find/, function(next) {
  this.populate('planId', 'name price features duration durationUnit');
  next();
});


const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;