// ===== Load Environment Variables =====
const dotenv = require('dotenv');
dotenv.config();

// ===== Import Dependencies =====
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const fileUpload = require('express-fileupload'); // ✅ Handles file uploads

// ===== Import Middleware =====
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// ===== Import Models =====
const User = require('./models/user'); 
const Client = require('./models/client'); 
const Service = require('./models/service');

// ===== Import Controllers =====
const authController = require('./controllers/auth.js');
const profileController = require('./controllers/profile.js');

// ===== Import Cloudinary =====
const cloudinary = require('./config/cloudinary');

const app = express();
const port = process.env.PORT ? process.env.PORT : '3000';

// Enable file uploads (MUST be added before routes)
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// ===== Connect to MongoDB =====
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// ===== Middleware =====
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev')); // Uncomment for logging

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// ===== Serve Static Files =====
app.use(express.static('public')); // For CSS, images, and JS

// ===== Pass User Data to Views =====
app.use(passUserToView);

// ===== Routes =====
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/profile`);
  } else {
    res.render('index.ejs');
  }
});

// ===== Turn VIP Lounge into Community Page =====
app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

app.use('/auth', authController); // Public authentication routes
app.use(isSignedIn); // Everything below this requires authentication

// ===== Protected Profile Page Route =====
app.use('/users/:userId/profile', profileController);

// ===== Profile Picture Upload Route =====
app.post('/upload-profile', async (req, res) => {
  try {
      if (!req.files || !req.files.profilePicture) {
          return res.status(400).send("No file uploaded.");
      }

      const file = req.files.profilePicture;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "profile_pictures",
          transformation: [
              { quality: "auto", fetch_format: "auto" },
              { width: 500, crop: "fill", gravity: "face" }
          ]
      });

      // Update user's profile photo URL
      const user = await User.findById(req.session.user._id);
      if (user) {
          user.profilePicture = result.secure_url;
          await user.save();
      }

      // Delete temp file
      fs.unlinkSync(file.tempFilePath);

      res.redirect(`/users/${req.session.user._id}/profile`);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error uploading profile picture.');
  }
});

// ===== Start Server =====
app.listen(port, () => {
  console.log(`ANGELA PANGELA! Your express app is FADING into view on port ${port}!`);
});