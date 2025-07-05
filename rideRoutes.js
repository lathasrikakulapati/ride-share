const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.post('/create', rideController.createRide);
router.post('/search', rideController.searchRide);

module.exports = router;
