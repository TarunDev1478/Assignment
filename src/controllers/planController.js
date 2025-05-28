import asyncHandler from ('../utils/asyncHandler');
import Plan from ('../models/Plan');

const getPlans = asyncHandler(async (req, res, next) => {
  const plans = await Plan.find({ isActive: true }).sort('price');

  res.status(200).json({
    success: true,
    count: plans.length,
    data: plans
  });
});

const getPlan = asyncHandler(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      error: 'Plan not found'
    });
  }

  res.status(200).json({
    success: true,
    data: plan
  });
});

const createPlan = asyncHandler(async (req, res, next) => {
  const plan = await Plan.create(req.body);

  res.status(201).json({
    success: true,
    data: plan
  });
});

const updatePlan = asyncHandler(async (req, res, next) => {
  let plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      error: 'Plan not found'
    });
  }

  plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: plan
  });
});

const deletePlan = asyncHandler(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      error: 'Plan not found'
    });
  }

  plan.isActive = false;
  await plan.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

export default {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan
};