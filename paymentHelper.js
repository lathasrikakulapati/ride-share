const stripe = require('../config/stripe');
const razorpay = require('../config/razorpay');

exports.captureStripePayment = async (paymentId) => {
  return await stripe.paymentIntents.capture(paymentId);
};

exports.cancelStripePayment = async (paymentId) => {
  return await stripe.paymentIntents.cancel(paymentId);
};

// Razorpay placeholder (you will integrate Razorpay order capture/refund here)
exports.captureRazorpayPayment = async (paymentId) => {
  // Razorpay capture logic
};

exports.refundRazorpayPayment = async (paymentId) => {
  // Razorpay refund logic
};
