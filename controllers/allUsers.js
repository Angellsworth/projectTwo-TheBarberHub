const express = require('express');
const router = express.Router()
const User = require('../models/user.js')

//Get /users - Show all users
router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.render('users/index.ejs', { users: allUsers, user: req.session.user })
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).send('Internal Server Error')
    }
})
module.exports = router;