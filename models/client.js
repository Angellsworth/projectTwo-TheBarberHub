const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cutsReceived: { 
    type: String, 
    enum: ['basic cut', 'bald fade', 'blow out taper', 'flat top', 'head shave', 'long hair'], 
    required: true 
  },
  beardPreference: { 
    type: String, 
    enum: ['none', 'Beard, no Trim', 'Beard Trim', 'Beard Trim and Shave'], 
    default: 'none' 
  },
  getsWaxing: { type: Boolean, default: false },
  waxingAreas: { 
    type: String, 
    enum: ['none', 'one area', 'two areas', 'three areas'], 
    default: 'none' 
  },
  notes: { type: String },

  appointments: { type: [Date], default: [] }, // ✅ Ensure appointments exist as an array

  // Barber reference
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
});

// Check if model exists before defining
const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

module.exports = Client;