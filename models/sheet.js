const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model('User', UserSchema.UserSchema);

// Function returns sheet with sheetID from database. Since every ID of sheet is unique, it doesn't need 
// TODO popravi
module.exports.getSheet = function(sheetID, userID = 0, callback) {
    if (userID === 0) {
        User.findById(sheetID, (err, sheet) => {
            if(err) throw err;
            callback(null, sheet);
        });
    } else {
        User.findById(sheetID, (err, sheet) => {
            if(err) throw err;
            callback(null, sheet);
        });
    }
}

// Pushes new sheet to user with userID
// Returns newly created sheet
module.exports.addSheet = function(userID, newSheet, callback) {
    User.findByIdAndUpdate(userID, {$push: {"sheets": newSheet}}, { new: true }, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser.sheets[newUser.sheets.length - 1]);
    });
}

// Updates sheet at sheetID with updatedShet
// Returns updated user
module.exports.updateSheet = function(userID, sheetID, editedSheet, callback) {
    User.updateOne({_id: ObjectId(userID), "sheets._id": ObjectId(sheetID)}, {$set: {"sheets.$": editedSheet}}, {new: true}, (err, modifiedStatus) => {
        if(err) throw err;
        callback(null, modifiedStatus);
    });
}

// Pulls sheet from sheets array at index of sheetID
// Returns updates sheets
module.exports.deleteSheet = function(userID, sheetID, callback) {
    User.findByIdAndUpdate(userID, {$pull: {"sheets": {_id: ObjectId(sheetID)}}}, {new: true}, (err, updatedUser) => {
        if(err) throw err;
        callback(null, updatedUser.sheets);
    });
}