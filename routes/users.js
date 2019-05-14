const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/database');

const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {
    // Initializes user with sent data and date
    let newUser = new User({
        userProfile: {
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userCreated: moment().format('DD.MM.YYYY:MM:SS'),
            userModified: moment().format('DD.MM.YYYY:MM:SS'),
            password: req.body.password
        }
    });
    // Checks if username and email are available
    User.areUsernameAndEmailAvailable(newUser.userProfile.username, newUser.userProfile.email, null, (err, isAvailable) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, msg: 'Server error' }).status(500);
        }
        // If username and email are available, it continuous to add user with addUser function
        if(isAvailable.success) {
            // Calls addUser method for adding new user
            User.addUser(newUser, (err, user)  => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Failed to register user, ' + err
                    }).status(500);
                } else{
                    // Responds with 201 Created and userID
                    res.json({
                        success: true,
                        msg: 'Successfully added user, ' + user._id
                    }).status(201); 
                }
            });
        } else {
            // If username or email is taken, it returns 400 Client error with message wich one is taken
            return res.json({
                success: false,
                msg: isAvailable.msg
            }).status(400);
        }
    })
});



// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // It finds all users with given username
    User.getUserByUsername(username, (err, user) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, msg: 'Server error' }).status(500);
        }
        // Returns 400 Client error if user doesn't exist
        if(!user) {
            return res.json({
                success: false,
                msg: "User doesn't exist"
            }).status(400);
        }
        // If it exists, it compares given and hashed password in found user
        User.comparePasswords(password, user.userProfile.password, (err, isMatch)  => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if (isMatch) {
                // If password are matched, it created token with user data that expires in 1209600 seconds (2 weeks)
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 1209600 // 2 weeks
                });
                // Deletes password hash for safety
                var userProfile = user.userProfile;
                userProfile.password = undefined;
                // Responds with status 200 OK with data of user and created token
                return res.json({
                    _id: user._id,
                    success: true,
                    token: 'JWT ' + token,
                    userData: {
                        userProfile: userProfile,
                        userSheets: user.userSheets,
                        userTemplates: user.userTemplates
                    }
                }).status(200)
            } else {
                // If password is incorrect, it responds with 400 Client error and message
                return res.json({
                    success: false,
                    msg: 'Wrong password'
                }).status(400);
            }            
        })
    })
});

// Checks if username is available. Username for checking comes through as first URL parameter
router.get('/usernameAvailability', (req, res) => {
    // TODO dodaj da če uporabnik da not še userID
    User.isUsernameAvailable(req.query.username, (err, isAvailable) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, msg: 'Server error' }).status(500);
        }
        if(isAvailable) {
            // Responds with status 200 if username is available
            return res.send(true).status(200);
        } else {
            // Responds with status 400 Client error if username is taken
            return res.send(false).status(400);
        }
    })
})

// Checks if email is available. Email for check comes through as first URL parameter
router.get('/emailAvailability', (req, res) => {
    User.isEmailAvailable(0, req.query.email, (err, isAvailable) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, msg: 'Server error' }).status(500);
        }
        if(isAvailable) {
            // Responds with status 200 if email is available
            return res.send(true).status(200);
        } else {
            // Responds with status 400 Client error if email is taken
            return res.send(false).status(400);
        }
    });
})

// Profile
router.route('/profile')
    // Send user account
    .get(passport.authenticate('jwt', {session: false}), (req, res) => {
        // Returns user, given in token payload
        return res.json({
            user: req.user
        }).status(200);
    })
    // Updates user account
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        // TODO uredi urejanje profila
        return res.send('Building on it').status(501);
    })
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        // Deletes document with id in jwt payload
        User.deleteUser(req.user._id, (err, user) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if(!user) {
                // Returns 400 Client error if user doesn't exist
                return res.json({
                    success: false,
                    msg: "User doesn't exist"
                }).status(400);
            }
            if(user) {
                // Returns 200 OK if user is deleted
                return res.json({
                    success: true,
                    msg: `User ${user.userProfile.username} deleted`
                }).status(200);
            }
        });
    })


// User forgets password, sets new one and sends it to email
router.get('/resetPass', (req, res) => {
    // TODO password reset
    return res.json({
        success: false,
        msg: 'Not implemented'
    }).status(501);
})


module.exports = router;