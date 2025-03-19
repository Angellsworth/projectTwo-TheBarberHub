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
const staticPagesController = require('./controllers/staticPages.js');
// const fileUpload = require('express-fileupload'); 

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
const allUsersController = require('./controllers/allUsers.js')

// ===== Import Cloudinary =====
// const cloudinary = require('./config/cloudinary');

const app = express();
const port = process.env.PORT ? process.env.PORT : '3000';

// Enable file uploads (MUST be added before routes)
// app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

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
  
  app.use('/auth', authController); // Public authentication routes
  app.use('/info', staticPagesController);
  
  // ===== Protected - Everything below this requires authentication =====
  app.use(isSignedIn);
  app.use('/users', allUsersController)
  app.use('/users/:userId/profile', profileController);

// ===== Start Server =====
app.listen(port, () => {
  console.log(`ANGELINA! Your express app is FADING into view on port ${port}!`);
});