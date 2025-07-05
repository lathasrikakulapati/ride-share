const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start: {
    name: String
  },
  end: {
    name: String
  },
  route: [
    {
      lat: Number,
      lng: Number
    }
  ],
  price: Number,
  vehicleType: String
});

module.exports = mongoose.models.Ride || mongoose.model('Ride', rideSchema);
