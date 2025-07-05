// Simple placeholder — in real case, you'd verify JWT or session
module.exports = (req, res, next) => {
  // For now, mock user
  req.user = { _id: '60f8a4a50d5e4c001c7e6c0a' }; 
  next();
};
