const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;

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

module.exports.updateSheet = function(userId, sheetId, editedSheet, callback) {
    User.updateOne({_id: ObjectId(userId), "userSheets._id": ObjectId(sheetId)}, {$set: {"userSheets.$": editedSheet}}, {new: true}, (err, modifiedStatus) => {
        if(err) throw err;
        callback(null, modifiedStatus);
    });
}

module.exports.deleteSheet = function(userId, sheetId, callback) {
    User.findByIdAndUpdate(userId, {$pull: {"userSheets": {_id: ObjectId(sheetId)}}}, {new: true}, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser.userSheets);
    });
}