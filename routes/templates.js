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
        return res.json({
            success: false,
            msg: 'Not implemented'
        }).status(501);
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        let template = {
            userTemplates: [ req.body ]
        };
        let userID = req.user._id;
        Template.addTemplate(template, userID, (err, template) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            return res.json({
                success: true,
                msg: template.title + ' created',
                data: template
            }).status(201);
        });
    })
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        req.body.modified = Date.now();
        Template.updateTemplate(req.user._id, req.body._id, req.body, (err, modifiedStatus) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            const templateTitle = req.body.title;
            if(modifiedStatus.n === 0) {
                return res.json({
                    success: false,
                    msg: templateTitle + " doesn't exist"
                }).status(400);
            }
            if(( modifiedStatus.n === 1 && modifiedStatus.nModified === 1 ) || ( modifiedStatus.n === 1 && modifiedStatus.nModified === 0 )) {
                return res.json({
                    success: true,
                    msg: templateTitle + ' updated'
                }).status(200);
            }
        })
    })
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        Template.deleteTemplate(req.user._id, req.query.templateId, (err, updatedUser) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if(!updatedUser) {
                return res.json({
                    success: false,
                    msg: "Template doesn't exist"
                }).status(400);
            }
            if(updatedUser) {
                return res.json({
                    success: true,
                    msg: 'Template deleted',
                    data: updatedUser.userTemplates
                }).status(200);
            }
        });
    })

module.exports = router;