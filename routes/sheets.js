const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Sheet = require('../models/sheet');


// Sheet
router.route('/sheet')
    .get(passport.authenticate('jwt', {session: false}, (req, res) => {
        console.log('Get sheet dela');
        res.end();
    }))
    .post(passport.authenticate('jwt', {session: false}), (req, res) => {
        let sheet = {
            userSheets: [ req.body ]
        };
        let userID = req.user._id;
        Sheet.addSheet(sheet, userID, (err, newsheet) => {
            if(err) res.json({ success: false, msg: 'Adding sheet failed' });
            res.json({
                success: true,
                msg: newsheet.title + ' added',
                data: newsheet
            });
        });
    })
    .put(passport.authenticate('jwt', {session: false}, (req, res) => {
       console.log('Put sheet dela');
       console.log(req.params);
       res.end();
    }))
    .delete(passport.authenticate('jwt', {session: false}), (req, res) => {
        const sheetId = req.query.id;
        const userId = req.user._id;
        Sheet.deleteSheet(userId, sheetId, (err, updatedSheets) => {
            if(err) throw err;
            res.json({
                success: true,
                msg: 'Sheet' + sheetId + ' deleted',
                data: updatedSheets.userSheets
            });
        });
    })

module.exports = router;