const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');
require('../config/passport')(passport);

const Template = require('../models/template');


// Template
router.route('/template')
    .get(passport.authenticate('jwt', {session: false}, (req, res) => {
        // TODO Dodaj da vrne template, z indeksom ali brez
        return res.json({
            success: false,
            msg: 'Not implemented'
        }).status(501);
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        let template = req.body;
        let userID = req.user._id;
        Template.addTemplate(template, userID, (err, template) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            // Returns with newly created template data with status 201 Created
            return res.json({
                success: true,
                msg: template.title + ' created',
                data: template
            }).status(201);
        });
    })
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        // Sets modified to current time
        req.body.modified = moment().format('YYYY-MM-DDTHH:mm:ss')
        Template.updateTemplate(req.user._id, req.body._id, req.body, (err, modifiedStatus) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            const templateTitle = req.body.title;
            // If n is 0, template doesn't exist. Returns status 400
            if(modifiedStatus.n === 0) {
                return res.json({
                    success: false,
                    msg: templateTitle + " doesn't exist"
                }).status(400);
            }
            // If template is found and is modified OR is found and not modified, it returns status 200
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
            // If template doesn't exist, it returns status 400
            if(!updatedUser) {
                return res.json({
                    success: false,
                    msg: "Template doesn't exist"
                }).status(400);
            }
            // If template is deleted, it returns 200 OK with deleted template
            if(updatedUser) {
                return res.json({
                    success: true,
                    msg: 'Template deleted',
                    data: updatedUser.templates
                }).status(200);
            }
        });
    })

module.exports = router;