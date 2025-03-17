const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const profileController = require('./controllers/profile.js')
const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static('public'))//static asset middleware- used to send static assets to the client (css, images, dom manipulation javascript)

// passUserToView middleware must come after session middleware
app.use(passUserToView);

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/profile`)
  } else {
    res.render('index.ejs')
  }
});
//====== Turn vip lounge into Community page
app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

app.use('/auth', authController); // Users can access auth routes freely
app.use(isSignedIn); // Everything below this now requires authentication

// Protected profile page route
app.use('/users/:userId/profile', profileController); // Users must be signed in to view/edit profile

app.listen(port, () => {
  console.log(`ANGELA PANGELA! Your express app is FADING into view on port ${port}!`);
});
