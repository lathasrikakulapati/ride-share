// Load environment variables
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');  // Modular MongoDB connection

// Import routes
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.static('public'));  // Serve frontend files from /public
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.json());  // For JSON request bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ride', rideRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/location', locationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Ride Sharing API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
