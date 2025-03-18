const express = require('express');
const router = express.Router();
const User = require('../models/user.js'); // Import the User model
const Client = require('../models/client.js'); // Import the Client model

/* ===========================
   RESTful Routing Reference
   INDEX    - GET    /users/:userId/profile           -> Show all clients for a user
   NEW      - GET    /users/:userId/profile/new       -> Form to add a new client
   CREATE   - POST   /users/:userId/profile/new       -> Add a new client to the database
   SHOW     - GET    /users/:userId/profile/clients/:clientId -> Show a single client
   DELETE   - DELETE /users/:userId/profile/clients/:clientId -> Delete a client
*/

// =====================================
// 1️⃣ SHOW FORM TO ADD A NEW CLIENT (NEW)
// Renders the form where the user can add a new client
router.get('/new', async (req, res) => {
    try {
        res.render('profile/new.ejs'); // Renders the new client form
    } catch (error) {
        console.error('Error loading new client form:', error);
        res.redirect('/users/:userId/profile'); // Redirects to profile if an error occurs
    }
});

// =====================================
// 2️⃣ CREATE A NEW CLIENT (CREATE)
// Handles the creation of a new client and links it to the user
router.post('/new', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) return res.status(404).send('User not found');

        const newClient = await Client.create({
            name: req.body.name,
            cutsReceived: req.body.cutsReceived,
            beardPreference: req.body.beardPreference,
            getsWaxing: req.body.getsWaxing === 'true', // Convert to boolean
            waxingAreas: req.body.waxingAreas || 'none',
            notes: req.body.notes || '',
            barber: user._id
        });

        user.clients.push(newClient._id); // Add client to user's client array
        await user.save(); // Save the updated user

        res.redirect(`/users/${user._id}/profile`); // Redirects to the profile page
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).send('Internal Server Error');
    }
});

// =====================================
// 3️⃣ SHOW FORM FOR NEW CLIENT WITH USER ID (NEW - Alternative)
// This route renders the same "new client" form, but it explicitly includes the user's ID
router.get('/:userId/new', async (req, res) => {
    try {
        res.render('profile/new.ejs', { userId: req.params.userId });
    } catch (error) {
        console.error('Error loading new client form:', error);
        res.redirect(`/users/${req.params.userId}/profile`);
    }
});

// =====================================
// 4️⃣ SHOW PROFILE PAGE WITH ALL CLIENTS (INDEX)
// Fetches the user and displays their profile along with all their clients
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate('clients'); // Populate user’s clients
        if (!user) return res.redirect('/auth/sign-in');

        res.render('profile/index.ejs', { user }); // Render profile page with client list
    } catch (error) {
        console.error('Error loading profile:', error);
        res.redirect('/');
    }
});

// =====================================
// 5️⃣ SHOW A SINGLE CLIENT'S DETAILS (SHOW)
// Retrieves a single client by ID and displays their details
router.get('/clients/:clientId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId).populate('barber');
        if (!client) return res.status(404).send('Client not found');

        res.render('profile/show.ejs', { client }); // Render the client's details page
    } catch (error) {
        console.error('Error fetching client details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// =====================================
// 6️⃣ DELETE A CLIENT (DELETE)
// Deletes a specific client by ID and removes them from the user's profile
router.delete('/clients/:clientId', async (req, res) => {
    try {
        // Find and delete the client
        const deletedClient = await Client.findByIdAndDelete(req.params.clientId);
        if (!deletedClient) return res.status(404).send('Client not found');

        // Redirect back to the user's profile page after deletion
        res.redirect(`/users/${req.session.user._id}/profile`);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
// EDIT - Show edit form for a specific client
router.get('/clients/:clientId/edit', async (req, res) => {
    try {
        console.log('✏️ Edit Route Hit!');
        console.log(`🔹 Client ID: ${req.params.clientId}`);

        const client = await Client.findById(req.params.clientId);
        if (!client) {
            console.log('❌ Client not found!');
            return res.status(404).send('Client not found');
        }

        console.log('✅ Rendering edit.ejs with client data');
        res.render('profile/edit.ejs', { client });
    } catch (error) {
        console.error('❌ Error fetching client for editing:', error);
        res.status(500).send('Internal Server Error');
    }
});
// PUT - Update Client Details
router.put('/clients/:clientId', async (req, res) => {
    try {
        console.log('✏️ Edit Route Hit! Updating Client:', req.params.clientId);

        // Find the client and update details
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.clientId,
            {
                name: req.body.name,
                cutsReceived: req.body.cutsReceived,
                beardPreference: req.body.beardPreference,
                getsWaxing: req.body.getsWaxing === 'on', // Checkbox values return 'on' if checked
                waxingAreas: req.body.waxingAreas,
                notes: req.body.notes
            },
            { new: true } // Return the updated client
        );

        if (!updatedClient) {
            return res.status(404).send('Client not found');
        }

        console.log('✅ Client Updated:', updatedClient);
        
        // Redirect back to the client's profile page
        res.redirect(`/users/${updatedClient.barber._id}/profile`);
    } catch (error) {
        console.error('❌ Error updating client:', error);
        res.status(500).send('Internal Server Error');
    }
});

// =====================================
// EXPORT THE ROUTER
module.exports = router;