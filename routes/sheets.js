const express = require('express');
const router = express.Router();
const moment = require('moment');
const passport = require('passport');
require('../config/passport')(passport);

const Sheet = require('../models/sheet');

// Sheet
router.route('/sheet')
    .get(passport.authenticate('jwt', {session: false}, (req, res) => {
        const userID = req.user._id;
        const sheetID = req.query.sheetID;
        if(sheetID) {
            Sheet.getSheet(userID, sheetID, (err, sheet) => {
                if(err) throw err;
                if(sheet) {
                    return res.json({
                        success: true,
                        msg: 'Found sheet with id ' + sheetID,
                        data: sheet
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: 'Sheet with id ' + sheetID + "sheet doesn't exist",
                        data: null
                    })
                }
            })
        } else {
            const sortType = req.query.type;
            const limit = req.query.limit;
            const page = req.query.page;
            Sheet.getSortedSheets(userID, sortType, (err, sheets) => {
                if(err) throw err;
                if(sheets) {
                    return res.json({
                        success: true,
                        msg: `Sorted sheets by: ${sortType}, limit: ${limit}, page: ${page}`,
                        data: null
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: 'Failed to get sheets',
                        data: null
                    });
                }
            })
        }
        // TODO Dodaj da vrne sheet z id-jem
        return res.send().status(501);
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        // Extracts sheet object from HTTP body and userID
        let editedSheet = req.body;
        editedSheet.sheetCreated = moment().format('YYYY-MM-DDTHH:mm:ss');
        editedSheet.sheetModified = moment().format('YYYY-MM-DDTHH:mm:ss');
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
        updatedSheet.modified = moment().format('YYYY-MM-DDTHH:mm:ss')
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


router.put('/setStatus', passport.authenticate('jwt', {session: false}), (req, res) => {
    const userID = req.user._id;
    const sheetID = req.body.sheetID;
    const newStatus = req.body.status;    
    Sheet.setStatus(userID, sheetID, newStatus, (err, modifiedStatus) => {
        if(err) throw err;
        if(( modifiedStatus.n === 1 && modifiedStatus.nModified === 1 ) || ( modifiedStatus.n === 1 && modifiedStatus.nModified === 0 )) {
            return res.json({
                success: true,
                msg: 'Status changed to ' + newStatus,
                data: moment().format('YYYY-MM-DDTHH:mm:ss')
            }).status(200);
        } else return res.json({
            success: false,
            msg: 'Error updating sheet status to ' + newStatus
        }).status(500);
    })
})

router.put('/setPriority', passport.authenticate('jwt', {session: false}), (req, res) => {
    const userID = req.user._id;
    const sheetID = req.body.sheetID;
    const newPriority = req.body.priority;
    Sheet.setPriority(userID, sheetID, newPriority, (err, modifiedStatus) => {
        if(err) throw err;
        if(( modifiedStatus.n === 1 && modifiedStatus.nModified === 1 ) || ( modifiedStatus.n === 1 && modifiedStatus.nModified === 0 )) {
            return res.json({
                success: true,
                msg: 'Priority changed to ' + newPriority,
                data: moment().format('YYYY-MM-DDTHH:mm:ss')
            }).status(200);
        } else {
            return res.json({
                success: false,
                msg: 'Error updating sheet priority to ' + newPriority
            }).status(500);
        }
    })
})

router.get('/sort', passport.authenticate('jwt', {session: false}), (req, res) => {
    const userID = req.user._id;
    const type = req.query.type;
    const limit = () => {
        if(req.query.limit) { return req.query.limit; }
        else { return 16; }
    }
    const page = () => {
        if(req.query.page) { return req.query.page; }
        else { return 1; }
    }
    const order = () => {
        if(req.query.order) { return req.query.order; }
        else { return 'descending'; }
    }
    Sheet.getSortedSheets(userID, type, order(), limit(), page(), (err, sheets) => {
        if(err) throw err;
        if(!sheets) {
            return res.json({
                success: false,
                msg: 'Failed to sort sheets by ' + type,
            }).status(400);
        } else {
            return res.json({
                success: true,
                msg: 'Found and returned sheets, sorted by ' + type + ' ' + order(),
                data: sheets
            }).status(200);
        }
    });
})

module.exports = router;