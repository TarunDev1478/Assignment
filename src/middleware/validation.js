import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const validateMongoId = (paramName) => {
  return param(paramName)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid ID format');
};

const validateRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateCreateSubscription = [
  body('planId')
    .notEmpty().withMessage('Plan ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid plan ID format'),
  handleValidationErrors
];

const validateUpdateSubscription = [
  validateMongoId('userId'),
  body('planId')
    .notEmpty().withMessage('Plan ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid plan ID format'),
  handleValidationErrors
];

const validateCreatePlan = [
  body('name')
    .trim()
    .notEmpty().withMessage('Plan name is required')
    .isLength({ max: 50 }).withMessage('Plan name cannot exceed 50 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom((value) => value >= 0).withMessage('Price cannot be negative'),
  body('features')
    .isArray({ min: 1 }).withMessage('At least one feature is required'),
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('durationUnit')
    .notEmpty().withMessage('Duration unit is required')
    .isIn(['days', 'months', 'years']).withMessage('Invalid duration unit'),
  handleValidationErrors
];

export default {
  validateRegistration,
  validateLogin,
  validateCreateSubscription,
  validateUpdateSubscription,
  validateCreatePlan,
  validateMongoId,
  handleValidationErrors
};