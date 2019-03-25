const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Template = require('../models/template');

const config = require('../config/database');

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
                    res.json({success: false, msg: 'Failed to register user, ' + err});
                } else{
                    res.json({success: true, msg: 'Successfully added user, ' + user._id}); 
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
            return res.json({success: false, msg: "User doesn't exist"});
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
                return res.json({success: false, msg: 'Wrong password'});
            }            
        })
    })
});

router.route('/profile')
    // Send user account
    .get(passport.authenticate('jwt', {session: false}), (req, res) => {
        res.json({user: req.user});
    })
    // Updates user account
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        const username = req.body.userProfile.username;
        const email = req.body.userProfile.email;
        const id = req.user._id;

        User.areUsernameAndEmailAvailable(username, email, id, (err, isAvailable) => {
            if(err) throw err;
            if(isAvailable.success) {
                // If username and email are available, if updates user profile
                const updatedUser = req.body;
                User.updateUser(id, updatedUser, (err, updatedUserAndSuccess) => {
                    if(err) throw err;
                    res.json(updatedUserAndSuccess);
                });
            } else {
                res.json(isAvailable);
            }
        });
    })
    // Deletes user account
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        console.log('Delete');
        User.deleteUser(req.user._id, (err, user) => {
            if(err) throw err;
            if(!user) res.json({
                success: false,
                msg: "User doesn't exist"
            })
            if(user) res.json({
                success: true,
                msg: "User deleted"
            });
        });
    })

router.route('/template')
    .get(passport.authenticate('jwt', {session: false}, (req, res) => {
        res.send('Request get recieved ')
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        let template = {
            userTemplates: [ req.body ]
        };
        let userID = req.user._id;
        let templateTitle = req.body.title;
        Template.addTemplate(template, userID, (err, template) => {
            if(err) res.json({ success: false, msg: 'Adding template failed: ' + err })
            res.json({ success: true, msg: templateTitle + ' added' });
        });
    })
    .put(passport.authenticate('jwt', {session: false}, (req, res) => {
        res.send('Request put recieved ')
    }))
    .delete(passport.authenticate('jwt', {session: false}, (req, res) => {
        res.send('Request delete recieved ')
    }))

module.exports = router;