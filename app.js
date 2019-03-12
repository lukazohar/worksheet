const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connects to database
mongoose.connect(config.database, { useNewUrlParser: true });

// If connection succedess
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database)
});

// If theres error
mongoose.connection.on('error', (err) => {
    console.log('Error: ' + err)
});
mongoose.set('useFindAndModify', false);

// Starts express
const app = express();

// Body parser
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Server port
const port = 3000;

// Enables CORS
app.use(cors({
    origin: 'http://localhost:4200'
}));

const users = require('./routes/users');

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');

app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Invalid URI');
})

app.get('/api'), (req, res) => {
    res.send('Welcome to my API for WorkSheet')
}

// Start server
app.listen(port, () => {
    console.log("Server has started on port " + port);
});