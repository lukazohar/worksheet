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
        let newTemplateFromBody = req.body;
        newTemplateFromBody.templateCreated = moment().format('YYYY-MM-DDTHH:mm:ss');
        newTemplateFromBody.templateModified = moment().format('YYYY-MM-DDTHH:mm:ss');
        const userID = req.user._id;

        Template.addTemplate(newTemplateFromBody, userID, (err, newTemplate) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if(!newTemplate) {
                return res.json({
                    success: false,
                    msg: 'Failed to add template'
                }).status(500);   
            } else {
                // Returns with newly created template data with status 201 Created
                return res.json({
                    success: true,
                    msg: newTemplate.title + ' created',
                    data: newTemplate
                }).status(201);
            }
        });
    })
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        // Sets modified to current time
        req.body.templateModified = moment().format('YYYY-MM-DDTHH:mm:ss')
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


router.get('/sortTemplates', passport.authenticate('jwt', {session: false}), (req, res) => {
    let hasRunAlready = false;
    const userID = req.user._id;
    const type = req.query.type;
    const limit = () => {
        if(req.query.limit) { return req.query.limit; }
        else { return 16; }
    }
    const page = () => {
        if(req.query.page) { return req.query.page; }
        else { return 0; }
    }
    const order = () => {
        if(req.query.order) { return req.query.order; }
        else { return 'descending'; }
    }
    Template.getSortedTemplates(userID, type, order(), limit(), page(), (err, templates) => {
        if(err) throw err;
        if(!templates) {
            return res.json({
                success: false,
                msg: 'Failed to sort templates by ' + type,
            }).status(400);
        } else if(!hasRunAlready) {
            hasRunAlready = true;
            return res.json({
                success: true,
                msg: 'Found and returned templates, sorted by ' + type + ' ' + order(),
                data: templates
            }).status(200);
        }
    });
})

router.get('/queryTemplates', passport.authenticate('jwt', {session: false}), (req, res) => {
    const userID = req.user._id;
    const query = () => {
        if(req.query.query) { return req.query.query; }
        else { return ''; }
    }
    const page = () => {
        if(req.query.page) { return req.query.page; }
        else { return 0; }
    }
    const limit = () => {
        if(req.query.limit) { return req.query.limit; }
        else { return 0; }
    }
    Template.getQueryedTemplates(userID, query(), limit(), page(), (err, queryedTemplates) => {
        if(err) throw err;
        if(queryedTemplates) {
            return res.json({
                success: true,
                msg: `Found queryed templates, query: ${query()}, limit: ${limit()}, page: ${page()}`,
                data: {
                    templates: queryedTemplates.templates,
                    noOfTemplates: queryedTemplates.noOfTemplates,
                    templatesTitles: queryedTemplates.templatesTitles
                }
            });
        } else {
            return res.json({
                success: false,
                msg: 'Failed to query templates',
                data: undefined
            });
        }
    });
})

module.exports = router;