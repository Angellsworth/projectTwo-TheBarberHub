const express = require('express');
const router = express.Router();

// GET /info/about Page
router.get('/about', (req, res) => {
    res.render('pages/about.ejs');
});

// GET /info/contact Page
router.get('/contact', (req, res) => {
    res.render('pages/contact.ejs');
});

// GET /info/faq Page
router.get('/faq', (req, res) => {
    res.render('pages/faq.ejs');
});

module.exports = router;