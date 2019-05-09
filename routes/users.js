const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        userProfile: {
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userCreated: Date.now(),
            userModified: Date.now(),
            password: req.body.password
        }
    });
    // Preveri če je forma pravilna
    User.areUsernameAndEmailAvailable(newUser.userProfile.username, newUser.userProfile.email, null, (err, isAvailable) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, msg: 'Server error' }).status(500);
        }
        if(isAvailable.success) {
            // Calls addUser method for adding new user
            User.addUser(newUser, (err, user)  => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Failed to register user, ' + err
                    }).status(500);
                } else{
                    res.json({
                        success: true,
                        msg: 'Successfully added user, ' + user._id
                    }).status(201); 
                }
            });
        } else {
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

    User.getUserByUsername(username, (err, user) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, msg: 'Server error' }).status(500);
        }
        if(!user) {
            return res.json({
                success: false,
                msg: "User doesn't exist"
            }).status(400);
        }

        User.comparePasswords(password, user.userProfile.password, (err, isMatch)  => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 1209600 // 1 week
                });
                // Deletes password hash for safety
                var userProfile = user.userProfile;
                userProfile.password = undefined;

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
                return res.json({
                    success: false, msg: 'Wrong password'
                }).status(400);
            }            
        })
    })
});

// Checks if username is available. Username for check comes through as first URL parameter
router.get('/usernameAvailability', (req, res) => {
    User.isUsernameAvailable(0, req.query.username, (err, isAvailable) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, msg: 'Server error' }).status(500);
        }
        if(isAvailable) {
            return res.send(true).status(200);
        } else {
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
            return res.send(true).status(200);
        } else {
            return res.send(false).status(400);
        }
    });
})

// Profile
router.route('/profile')
    // Send user account
    .get(passport.authenticate('jwt', {session: false}), (req, res) => {
        return res.json({
            user: req.user
        }).status(200);
    })
    // Updates user account
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        return res.send('Building on it').status(501);
    })
    // Deletes user account
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        User.deleteUser(req.user._id, (err, user) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if(!user) {
                return res.json({
                    success: false,
                    msg: "User doesn't exist"
                }).status(400);
            }
            if(user) {
                return res.json({
                    success: true,
                    msg: `User ${user.userProfile.username} deleted`
                }).status(200);
            }
        });
    })


// User forgets password, sets new one and sends it to email
router.get('/resetPass', (req, res) => {
    return res.json({
        success: false,
        msg: 'Not implemented'
    }).status(501);
})


module.exports = router;