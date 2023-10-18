const dbConnection  = require('./database/connection');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;


// Set up session
app.use(session({
  secret: 'qwerty123', // Replace with a secret key
  resave: true,
  saveUninitialized: true
}));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


//view engine to EJS
app.set('view engine', 'ejs'); 


// Routes
app.use('/', require('./routes/auth')(dbConnection , bcrypt));
app.use('/', require('./routes/dashboard_route')(dbConnection , bcrypt));
app.get('/', (req, res) => {
    res.redirect('login');
  });
  
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

