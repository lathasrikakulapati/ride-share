const axios = require('axios');

exports.getDistanceMatrix = async (originLat, originLng, destLat, destLng) => {
  const key = 'YOUR_GOOGLE_MAPS_API_KEY';
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${key}`;
  
  const response = await axios.get(url);
  return response.data;
};
