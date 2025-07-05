const Ride = require('../models/ride');
const Booking = require('../models/booking');
const stripe = require('../config/stripe');
const { isValidPartialRoute } = require('../utils/validateRoute');

exports.bookRide = async (req, res) => {
  const { rideId, fromPoint, toPoint, paymentProvider } = req.body;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });

    if (!isValidPartialRoute(ride.stops, fromPoint, toPoint)) {
      return res.status(400).json({ error: 'Invalid route selection' });
    }

    const price = ride.price; // you may adjust price for partial

    // Stripe example
    let paymentIntent;
    if (paymentProvider === 'stripe') {
      paymentIntent = await stripe.paymentIntents.create({
        amount: price * 100, // cents
        currency: 'inr',
        payment_method_types: ['card'],
      });
    }

    const booking = await Booking.create({
      rideId,
      bookerId: req.user._id,
      fromPoint,
      toPoint,
      price,
      paymentProvider,
      paymentId: paymentIntent ? paymentIntent.id : 'razorpay-id-placeholder',
    });

    res.json({ booking, clientSecret: paymentIntent?.client_secret });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed', details: err });
  }
};
