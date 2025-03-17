const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js'); // Import the User model

// GET Profile Index Route
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        if(!user) {
            return res.redirect('/auth/sign-in')
        }
        res.render('profile/index.ejs', { user })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
  });


// Export the router at the bottom
module.exports = router;