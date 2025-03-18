const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  currentShop: { type: String },
  specialties: { type: [String], default: [] },
  experience: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  createdAt: { type: Date, default: Date.now },
  profilePicture: { 
    type: String, 
    default: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/default-profile-pic.png' 
  } 
});

// Check if model exists before defining
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;