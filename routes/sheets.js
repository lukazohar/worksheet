const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);

const Sheet = require('../models/sheet');


// Sheet
router.route('/sheet')
    .get(passport.authenticate('jwt', {session: false}, (req, res) => {
        return res.send().status(501);
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        let sheet = {
            userSheets: [ req.body ]
        };
        let userID = req.user._id;
        Sheet.addSheet(sheet, userID, (err, newsheet) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if(!newsheet) {
                return res.json({
                    success: false,
                    msg: 'Failed to add sheet'
                }).status(500);   
            }
            if(newsheet) {
                return res.json({
                    success: true,
                    msg: newsheet.title + ' added',
                    data: newsheet
                }).status(201);
            }
        });
    })
    .put(passport.authenticate('jwt', {session: false}), (req, res) => {
        const userId = req.user._id;
        const sheetId = req.body._id;
        const updatedSheet = req.body;
        updatedSheet.modified = Date.now();
        Sheet.updateSheet(userId, sheetId, updatedSheet, (err, modifiedStatus) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            const sheetTitle = req.body.title;
            if(modifiedStatus.n === 0) {
                return res.json({
                    success: false,
                    msg: sheetTitle + " doesn't exist"
                }).status(400);
            }
            if(( modifiedStatus.n === 1 && modifiedStatus.nModified === 1 ) || ( modifiedStatus.n === 1 && modifiedStatus.nModified === 0 )) {
                return res.json({
                    success: true,
                    msg: sheetTitle + ' updated'
                }).status(200);
            }
        });
    })
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        const userId = req.user._id;
        const sheetId = req.query.sheetId;
        Sheet.deleteSheet(userId, sheetId, (err, updatedSheets) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            if(!updatedSheets) {
                return res.json({
                    success: false,
                    msg: "Sheet doesn't exist"
                }).status(400);
            }
            if(updatedSheets) {
                return res.json({
                    success: true,
                    msg: 'Sheet deleted',
                    data: updatedSheets
                }).status(200);
            }
        });
    })

module.exports = router;