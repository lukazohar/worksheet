const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const schedule = require('node-schedule');
const backup = require('mongodb-backup');

// Connects to database
mongoose.connect(config.database, { useNewUrlParser: true });

// If connection succedess
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database)
});

// Checks for errors
mongoose.connection.on('error', (err) => {
    console.log('Error: ' + err)
});
mongoose.set('useFindAndModify', false);

// Starts express
const app = express();

// Body parser
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Enables CORS
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Users router
const users = require('./routes/users');
app.use('/api/users', users);

// Templates route
const templates = require('./routes/templates');
app.use('/api/templates', templates);

// Sheets router
const sheets = require('./routes/sheets');
app.use('/api/sheets', sheets);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Imports passport
require('./config/passport');

app.get('/', (req, res) => {
    res.send('Invalid URI');
})

app.get('/api'), (req, res) => {
    res.send('Welcome to my API for WorkSheet')
}

// Created backup every TIME
// const test = schedule.scheduleJob('*/5 * * * * *', () => {
//    backup({
//        uri: config.database,
//        root: './dbBackup'
//    });
//    const dbName = 'workSheet';
//    console.log('Backup of ' + dbName + ' created');
// });

// Server port
const port = 3000;

// Start server
app.listen(port, () => {
    console.log("Server has started on port " + port);
});