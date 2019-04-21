const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Template = require('../models/template');


// Template
router.route('/template')
    .get(passport.authenticate('jwt', {session: false}, (req, res) => {
        res.send('Request get recieved ')
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        let template = {
            userTemplates: [ req.body ]
        };
        let userID = req.user._id;
        Template.addTemplate(template, userID, (err, template) => {
            if(err) res.json({ success: false, msg: 'Adding template failed: ${err}' });
            res.json({
                success: true,
                msg: template.title + ' added',
                data: template
            });
        });
    })
    .put(passport.authenticate('jwt', {session: false}, (req, res) => {
        res.send('Request put recieved ');
    }))
    .delete(passport.authenticate('jwt', {session: false}, (req, res) => {
        res.send('Request delete recieved ');
    }))

module.exports = router;