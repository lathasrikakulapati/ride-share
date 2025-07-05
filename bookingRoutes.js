const express = require('express');
const router = express.Router();
const { bookRide } = require('../controllers/bookingController');
const { completeRide } = require('../controllers/locationController');

router.post('/book', bookRide);
router.post('/complete', completeRide);

module.exports = router;
