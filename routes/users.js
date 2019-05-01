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
    User.areUsernameAndEmailAvailable(newUser.userProfile.username, newUser.userProfile.email, null, (err, isAvailable) => {
        if(err) throw err;
        if(isAvailable.success) {
            // Calls addUser method for adding new user
            User.addUser(newUser, (err, user)  => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Failed to register user, ' + err
                    });
                } else{
                    res.json({
                        success: true,
                        msg: 'Successfully added user, ' + user._id
                    }); 
                }
            });
        } else {
            res.send(isAvailable);
        }
    })
});



// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({
                success: false,
                msg: "User doesn't exist"
            });
        }

        User.comparePasswords(password, user.userProfile.password, (err, isMatch)  => {
            if(err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 1209600 // 1 week
                });
                // Deletes password hash for safety
                var userProfile = user.userProfile;
                userProfile.password = undefined;

                res.json({
                    _id: user._id,
                    success: true,
                    token: 'JWT ' + token,
                    userData: {
                        userProfile: userProfile,
                        userSheets: user.userSheets,
                        userTemplates: user.userTemplates
                    }
                })
            } else {
                return res.json({
                    success: false, msg: 'Wrong password'
                });
            }            
        })
    })
});

// Checks if username is available. Username for check comes through as first URL parameter
router.get('/usernameAvailability', passport.authenticate('jwt', {session: false}), (req, res) => {
    User.isUsernameAvailable(req.user._id = 0, req.query.username, (err, isAvailable) => {
        if(err) throw err;
        if(isAvailable) {
            res.send(true)
        } else {
            res.send(false)
        }
    })
})

// Checks if email is available. Email for check comes through as first URL parameter
router.get('/emailAvailability', passport.authenticate('jwt', {session: false}), (req, res) => {
    User.isEmailAvailable(req.user._id = 0, req.query.email, (err, isAvailable) => {
        if(err) throw err;
        if(isAvailable) {
            res.json({
                success: true,
                msg: 'Email is available'
            })
        } else {
            res.json({
                success: false,
                msg: 'Email is already taken'
            })
        }
    })
})

// Profile
router.route('/profile')
    // Send user account
    .get(passport.authenticate('jwt', {session: false}), (req, res) => {
        res.json({
            user: req.user
        });
    })
    // Updates user account
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        res.send('Building on it');
    })
    // Deletes user account
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        User.deleteUser(req.user._id, (err, user) => {
            if(err) throw err;
            if(!user) res.json({
                success: false,
                msg: "User doesn't exist"
            })
            if(user) res.json({
                success: true,
                msg: `User ${user.userProfile.username} deleted`
            });
        });
    })


// User forgets password, sets new one and sends it to email
router.get('/resetPass', (req, res) => {
    User.resetPassword(req.params.id, (err, status) => {
        if (err) throw err;
    })
    res.end();
})


module.exports = router;