const express = require('express');
const router = express.Router();
const { completeRide } = require('../controllers/locationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect route with auth
router.post('/complete', authMiddleware, completeRide);

module.exports = router;
