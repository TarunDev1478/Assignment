import mongoose from "mongoose";
import constants from "../utils/constant.js"; 

const { DURATION_UNITS } = constants; 

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Plan name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Plan price is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number,
    required: [true, 'Plan duration is required'],
    min: [1, 'Duration must be at least 1']
  },
  durationUnit: {
    type: String,
    enum: Object.values(DURATION_UNITS),
    default: DURATION_UNITS.MONTHS
  },
  maxUsers: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

planSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeInactive) {
    this.find({ isActive: true });
  }
  next();
});

const Plan = mongoose.model('Plan', planSchema);
export default Plan;