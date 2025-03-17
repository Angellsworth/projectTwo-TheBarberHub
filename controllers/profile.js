const express = require('express');
const router = express.Router();
const { User, Client } = require('../models/user.js'); // Import the User model

// GET Profile Index Route
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.redirect('/auth/sign-in');
        }
        res.render('profile/index.ejs', { user });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// GET /users/:userId/profile/new - Show form for new client
router.get('/new', async (req, res) => {
    try {
        res.render('profile/new.ejs');
    } catch (error) {
        console.error('Error loading new client form:', error);
        res.redirect('/users/:userId/profile');
    }
});

// POST /users/:userId/profile/new - Create new Client
router.post('/new', async (req, res) => {
    try {
        // Step 1: Find the user who is adding a client
        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Step 2: Create a new client object in MongoDB seperate from user
        const newClient = await Client.create({
            name: req.body.name,
            cutsReceived: req.body.cutsReceived,
            beardPreference: req.body.beardPreference,
            getsWaxing: req.body.getsWaxing === 'true', // Convert to boolean
            waxingAreas: req.body.waxingAreas || 'none',
            notes: req.body.notes || '',
        });

        // Step 3: Only Add 'newClient' to the user's CLIENT array
        user.clients.push(newClient._id);
        await user.save(); //save only the updated user, not a new one

        // Save the updated user
        await user.save();
        console.log('Client successfully added:', newClient);

        // Step 4: Redirect back to profile page after adding client
        res.redirect(`/users/${user._id}/profile`);
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET /users/:userId/profile/new - Show form for new client
router.get('/:userId/new', async (req, res) => {
    try {
        res.render('profile/new.ejs', { userId: req.params.userId });
    } catch (error) {
        console.error('Error loading new client form:', error);
        res.redirect(`/users/${req.params.userId}/profile`);
    }
});

// GET Profile Index Route - Show User Profile with Clients
// router.get('/', async (req, res) => {
//     try {
//         const user = await User.findById(req.session.user._id).populate('clients'); // Populate clients
//         console.log("User's Clients before rendering:", user.clients)
//         if (!user) {
//             return res.redirect('/auth/sign-in');
//         }
//         console.log('User Profile Data', user)
//         res.render('profile/index.ejs', { user });
//     } catch (error) {
//         console.log(error);
//         res.redirect('/');
//     }
// });
router.get('/', async (req, res) => {
    try {
        // Find the user and populate their clients
        const user = await User.findById(req.session.user._id).populate('clients');

        if (!user) {
            return res.redirect('/auth/sign-in');
        }

        console.log("User's Clients before rendering:", user.clients); // Debugging step

        // Render profile index, passing user and clients to the view
        res.render('profile/index.ejs', {
            user,
            clients: user.clients, // Pass the populated clients to the view
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Export the router
module.exports = router;