const Booking = require('../models/booking');
const Ride = require('../models/ride');
const { haversineDistance } = require('../utils/distanceHelper');
const stripe = require('../config/stripe');

exports.completeRide = async (req, res) => {
  const { bookingId, lat, lng } = req.body;
  const booking = await Booking.findById(bookingId).populate('rideId');
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const ride = booking.rideId;
  const destinationLat = ride.destinationLat;  // assume you store lat/lng at post
  const destinationLng = ride.destinationLng;

  const distance = haversineDistance(destinationLat, destinationLng, lat, lng);

  if (distance <= 100) { // within 100m
    await stripe.paymentIntents.capture(booking.paymentId); // example for Stripe
    booking.paymentStatus = 'released';
  } else {
    await stripe.paymentIntents.cancel(booking.paymentId);
    booking.paymentStatus = 'refunded';
  }

  await booking.save();
  res.json({ message: 'Ride completed', status: booking.paymentStatus });
};
