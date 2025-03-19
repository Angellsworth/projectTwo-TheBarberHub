const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js'); // Import the User model

/* ===========================
   RESTful Routing Reference
   GET    /auth/sign-up  -> Show sign-up form
   POST   /auth/sign-up  -> Handle new user registration
   GET    /auth/sign-in  -> Show sign-in form
   POST   /auth/sign-in  -> Handle user login
   GET    /auth/sign-out -> Log user out and destroy session
*/

// =====================================
// SHOW SIGN-UP FORM (NEW)
// Renders the sign-up form for new users
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

// =====================================
// SHOW SIGN-IN FORM (NEW)
// Renders the login form for existing users
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

// =====================================
// SIGN OUT USER (DESTROY SESSION)
// Ends the user's session and logs them out
router.get('/sign-out', (req, res) => {
  req.session.destroy(); // Destroy the session
  res.redirect('/'); // Redirect to home page
});

// =====================================
// HANDLE SIGN-UP (CREATE NEW USER)
// Processes new user registration
router.post('/sign-up', async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }

    // Validate password confirmation
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create the new user object
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword, // Store hashed password
      name: req.body.name,
      currentShop: req.body.currentShop || 'Independent',
      specialties: req.body.specialties.split(',').map(skill => skill.trim()), // Convert input to an array
      experience: req.body.experience
    });

    await newUser.save(); // Save the user in the database

    res.redirect('/auth/sign-in'); // Redirect to login page after signup
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

/********************************************************************/
// HANDLE SIGN-IN (LOGIN USER)
// Processes user login
router.post('/sign-in', async (req, res) => {
  try {
    // Find the user in the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }
  
    // Compare the provided password with the hashed password in the database
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }
  
    // Create a session for the authenticated user
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
  
    res.redirect('/'); // Redirect to homepage after successful login
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// =====================================
// EXPORT THE ROUTER
module.exports = router;