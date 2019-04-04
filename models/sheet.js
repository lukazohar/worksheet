const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');

const User = mongoose.model('User', UserSchema.UserSchema);

module.exports.getSheet = function(sheetID, callback) {
    User.findById(sheetID, (err, sheet) => {
        if(err) throw err;
        callback(null, sheet);
    });
}

module.exports.addSheet = function(newSheet, userID, callback) {
    User.findByIdAndUpdate(userID, {$push: {"userSheets": newSheet.userSheets}}, { new: true }, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser.userSheets[newUser.userSheets.length - 1]);
    })
}

module.exports.updateSheet = function(sheetID, updatedSheet, callback) {
    User.findByIdAndUpdate(sheetID, {$pull: {"userSheets": {_id: ObjectId(sheetID)}}}, {new: true}, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser);
    })
}

module.exports.deleteSheet = function(sheetID, callback) {
    User.findByIdAndUpdate(sheetID, {$pull: {"userSheets": {_id: ObjectId(sheetID)}}}, {new: true}, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser);
    })
}