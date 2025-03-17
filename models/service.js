const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  type: { type: String, enum: ['cut', 'beard', 'waxing'], required: true },
  name: { type: String, required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to barber
});

// Check if model exists before defining
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

module.exports = Service;