const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');
require('../config/passport')(passport);

const Sheet = require('../models/sheet');


// Sheet
router.route('/sheet')
    .get(passport.authenticate('jwt', {session: false}, (req, res) => {
        // TODO Dodaj da vrne sheet z id-jem
        return res.send().status(501);
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        // Extracts sheet object from HTTP body and userID
        let editedSheet = req.body;
        const userID = req.user._id;
        Sheet.addSheet(userID, editedSheet, (err, newsheet) => {
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
                // Responds with 201 status if sheet is created
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
        // Sets modified date to current
        updatedSheet.modified = moment().format('DD.MM.YYYY HH:mm');
        Sheet.updateSheet(userId, sheetId, updatedSheet, (err, modifiedStatus) => {
            if(err) {
                console.error(err);
                return res.json({ success: false, msg: 'Server error' }).status(500);
            }
            const sheetTitle = req.body.title;
            // If n is 0, sheet doesn't exist. Responds with 400 client error
            if(modifiedStatus.n === 0) {
                return res.json({
                    success: false,
                    msg: sheetTitle + " doesn't exist"
                }).status(400);
            }
            // If sheet is found and is modified OR sheet is found and not modified, it returns status 200 OK
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
                // Responds with 400 if sheet doesn't exist
                return res.json({
                    success: false,
                    msg: "Sheet doesn't exist"
                }).status(400);
            }
            if(updatedSheets) {
                // Responds with 200 OK if sheet is deleted and remaining sheets in array
                return res.json({
                    success: true,
                    msg: 'Sheet deleted',
                    data: updatedSheets
                }).status(200);
            }
        });
    })

module.exports = router;