//controllers/auth
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
/************************************************** */
router.post('/sign-up', async (req, res) => {
  console.log("Signup Route hit! Recieved data:", req.body)
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

    // Create the new user with all the fields from the signup form
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword, // Store hashed password
      name: req.body.name,
      currentShop: req.body.currentShop || 'Independent',
      specialties: req.body.specialties.split(',').map(skill => skill.trim()), // Convert input to an array
      experience: req.body.experience
    });

    await newUser.save(); // Save user in database
    console.log('User Successfully created', newUser)

    res.redirect('/auth/sign-in'); // Redirect to login page after signup
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
// router.post('/sign-up', async (req, res) => {
//   try {
//     // Check if the username is already taken
//     const userInDatabase = await User.findOne({ username: req.body.username });
//     if (userInDatabase) {
//       return res.send('Username already taken.');
//     }
  
//     // Username is not taken already!
//     // Check if the password and confirm password match
//     if (req.body.password !== req.body.confirmPassword) {
//       return res.send('Password and Confirm Password must match');
//     }
  
//     // Must hash the password before sending to the database
//     const hashedPassword = bcrypt.hashSync(req.body.password, 10);
//     req.body.password = hashedPassword;
  
//     // All ready to create the new user!
//     await User.create(req.body);
  
//     res.redirect('/auth/sign-in');
//   } catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// });
/******************************************************************** */
router.post('/sign-in', async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }
  
    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }
  
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
  
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
