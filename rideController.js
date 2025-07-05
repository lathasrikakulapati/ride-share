const Ride = require('../models/Ride');
const axios = require('axios');

// Helper distance calc (Haversine formula)
const haversine = (coord1, coord2) => {
  const R = 6371e3; // meters
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in meters
};

// POST /api/ride/create
exports.createRide = async (req, res) => {
  const { startPlace, endPlace, price, vehicleType } = req.body;

  if (!startPlace || !endPlace || !price || !vehicleType) {
    return res.status(400).json({ error: '❌ All fields are required (startPlace, endPlace, price, vehicleType)' });
  }

  try {
    // Get route from Google Maps API using place names
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: startPlace,
        destination: endPlace,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ error: '❌ Failed to get route from Google Maps' });
    }

    // Build route points
    const points = [];
    response.data.routes[0].legs[0].steps.forEach(step => {
      points.push({
        lat: step.start_location.lat,
        lng: step.start_location.lng
      });
      points.push({
        lat: step.end_location.lat,
        lng: step.end_location.lng
      });
    });

    const ride = new Ride({
      driver: req.user?._id || "dummyDriverId",  // placeholder until auth is integrated
      start: { name: startPlace },
      end: { name: endPlace },
      route: points,
      price,
      vehicleType
    });

    await ride.save();
    res.json({ message: '✅ Ride posted successfully', ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Server error' });
  }
};

// POST /api/ride/search
exports.searchRide = async (req, res) => {
  const { searchStartPlace, searchEndPlace } = req.body;

  if (!searchStartPlace || !searchEndPlace) {
    return res.status(400).json({ error: '❌ searchStartPlace and searchEndPlace are required' });
  }

  try {
    // Convert place names to coordinates
    const [startGeoRes, endGeoRes] = await Promise.all([
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: searchStartPlace, key: process.env.GOOGLE_MAPS_API_KEY }
      }),
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: searchEndPlace, key: process.env.GOOGLE_MAPS_API_KEY }
      })
    ]);

    if (
      startGeoRes.data.status !== 'OK' ||
      endGeoRes.data.status !== 'OK'
    ) {
      return res.status(400).json({ error: '❌ Failed to geocode one or both places' });
    }

    const searchStart = startGeoRes.data.results[0].geometry.location;
    const searchEnd = endGeoRes.data.results[0].geometry.location;

    const rides = await Ride.find();

    const matches = rides.filter(ride => {
      const nearStart = ride.route.some(point => haversine(point, searchStart) < 1000);
      const nearEnd = ride.route.some(point => haversine(point, searchEnd) < 1000);
      return nearStart && nearEnd;
    });

    res.json(matches);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: '❌ Server error' });
  }
};
