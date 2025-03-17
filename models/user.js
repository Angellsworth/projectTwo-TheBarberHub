const mongoose = require('mongoose');

// Client Schema: Tracks each barber's clients
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Client's name
  cutsReceived: { 
    type: String, 
    enum: ['basic cut', 'bald fade', 'blow out taper', 'flat top', 'head shave', 'long hair'], 
    required: true 
  }, // Cut preference
  beardPreference: { 
    type: String, 
    enum: ['none', 'hasBeard', 'getsBeardDone'], 
    default: 'none' 
  }, // Beard status
  getsWaxing: { type: Boolean, default: false }, // Does the client get waxing?
  waxingAreas: { 
    type: String, 
    enum: ['none', 'one area', 'two areas', 'three areas'], 
    default: 'none' 
  }, // If waxing, how much?
  notes: { type: String }, // Any special notes (picky client, likes a certain fade, etc.)
  appointments: { type: [Date], default: [] }, // Appointment history
  clientPhoto: { type: String, default: 'default-client.png' } // Placeholder for future image uploads
});

// Service Schema: Defines what services barbers provide
const serviceSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['cut', 'beard', 'waxing'], 
    required: true 
  }, // Service category
  name: { type: String, required: true } // Specific service name (e.g., "bald fade", "hot towel shave")
});

// User Schema: The core model for barbers
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Barber login
  password: { type: String, required: true }, // Hashed password
  name: { type: String, required: true }, // Barber's full name
  currentShop: { type: String}, // Barber shop they work at
  specialties: { type: [String], default: [] }, // Skills (e.g., "Fades", "Beard Trims")
  experience: { type: Number, default: 0 }, // Barbering experience in years
  upvotes: { type: Number, default: 0 }, // Community upvotes
  downvotes: { type: Number, default: 0 }, // Community downvotes
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }], // References instead of embedded docs
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // References instead of embedded docs
  createdAt: { type: Date, default: Date.now }, // When the barber joined
  profilePhoto: { type: String, default: 'default-profile.png' } // Placeholder for future profile uploads
});

// Export Models
const User = mongoose.model('User', userSchema);
const Client = mongoose.model('Client', clientSchema);
const Service = mongoose.model('Service', serviceSchema);

module.exports = { User, Client, Service };
