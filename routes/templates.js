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
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        Template.updateTemplate(req.user._id, req.body._id, req.body, (err, modifiedStatus) => {
            if(err) throw err;
            const templateTitle = req.body.title;
            if(modifiedStatus.n === 0) {
                res.json({
                    success: false,
                    msg: templateTitle + " doesn't exist"
                });
            }
            if(( modifiedStatus.n === 1 && modifiedStatus.nModified === 1 ) || ( modifiedStatus.n === 1 && modifiedStatus.nModified === 0 )) {
                res.json({
                    success: true,
                    msg: templateTitle + ' updated'
                });
            }
        })
    })
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        Template.deleteTemplate(req.user._id, req.query.templateId, (err, updatedUser) => {
            if(err) throw err;
            if(!updatedUser) {
                res.json({
                    success: false,
                    msg: "Template doesn't exist"
                });
            }
            if(updatedUser) {
                res.json({
                    success: true,
                    msg: 'Template deleted',
                    data: updatedUser.userTemplates
                });
            }
        });
    })

module.exports = router;