const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const sortModule = require('../modules/sheetSort');

const User = mongoose.model('User', UserSchema.UserSchema);

// Function returns sheet with sheetID from database. Since every ID of sheet is unique, it doesn't need 
// TODO popravi
module.exports.getSheet = function(userID, sheetID, callback) {
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

// Pushes sheet to user with userID
// Returns created sheet
module.exports.addSheet = function(userID, sheet, callback) {
    User.findByIdAndUpdate(userID, {$push: {"sheets": sheet}}, { new: true }, (err, ser) => {
        if(err) throw err;
        callback(null, ser.sheets[ser.sheets.length - 1]);
    });
}

// Updates sheet at sheetID with updatedShet
// Returns updated user
module.exports.updateSheet = function(userID, sheetID, editedSheet, callback) {
    User.updateOne({_id: ObjectId(userID), "sheets._id": ObjectId(sheetID)}, {$set: {"sheets.$": editedSheet}}, { new: true}, (err, modifiedStatus) => {
        if(err) throw err;
        callback(null, modifiedStatus);
    });
}

// Pulls sheet from sheets array at index of sheetID
// Returns updates sheets
module.exports.deleteSheet = function(userID, sheetID, callback) {
    User.findByIdAndUpdate(userID, {$pull: {"sheets": {_id: ObjectId(sheetID)}}}, { new: true}, (err, updatedUser) => {
        if(err) throw err;
        callback(null, updatedUser.sheets);
    });
}

module.exports.setStatus = function(userID, sheetID, status, callback) {
    User.updateOne({$set: {
            "sheets.$.status": status,
            "sheets.$.statusModified": moment().format('YYYY-MM-DDTHH:mm:ss'),
            "sheets.$.modified": moment().format('YYYY-MM-DDTHH:mm:ss')
        }})
        .where({_id: ObjectId(userID)})
        .where({"sheets._id": ObjectId(sheetID)})
        .exec({ new: true}, (err, modifiedStatus) => {
            if(err) throw err;
            callback(null, modifiedStatus);
        });
}

module.exports.setPriority = function(userID, sheetID, priority, callback) {
    User.updateOne({$set: {
            "sheets.$.priority": priority,
            "sheets.$.priorityModified": moment().format('YYYY-MM-DDTHH:mm:ss'),
            "sheets.$.modified": moment().format('YYYY-MM-DDTHH:mm:ss')
        }})
        .where({_id: ObjectId(userID)})
        .where({"sheets._id": ObjectId(sheetID)})
        .exec({ new: true}, (err, modifiedStatus) => {
            if(err) throw err;
            callback(null, modifiedStatus);
        });
}

module.exports.getSortedSheets = function(userID, sortType, order, limit, page, callback) {page
    User.findById(userID, (err, user) => {
        if(err) throw err;
        if(!user) {
            callback(null, undefined);
        } else {
            switch(sortType) {
                case 'date' : {
                    if(order == 'ascending') {
                        sortModule.orderSheetsByDateAscending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            console.log('TEST 1');
                            callback(null, orderedSheets);
                            console.log('TEST 2');
                        });
                    } else {
                        sortModule.orderSheetsByDateDescending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            callback(null, orderedSheets);
                        });
                    }
                };
                case 'priority' : {
                    if(order == 'ascending') {
                        sortModule.orderSheetsByPriorityAscending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            callback(null, orderedSheets);
                        });
                    } else {
                        sortModule.orderSheetsByPriorityDescending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            callback(null, orderedSheets);
                        });
                    }
                }
                case 'status' : {
                    if(order == 'ascending') {
                        sortModule.orderSheetsByStatusAscending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            callback(null, orderedSheets);
                        });
                    } else {
                        sortModule.orderSheetsByStatusDescending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            callback(null, orderedSheets);
                        });

                    }
                }
                case 'modified' : {
                    if(order == 'ascending') {
                        sortModule.orderSheetsBySheetmodifiedAscending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            callback(null, orderedSheets);
                        });
                    } else {
                        sortModule.orderSheetsBySheetmodifiedDescending(user.sheets, limit, page, (err, orderedSheets) => {
                            if(err) throw err;
                            callback(null, orderedSheets);
                        });
                    }
                }
                default : {
                    sortModule.orderSheetsByDateDescending(user.sheets, limit, page, (err, orderedSheets) => {
                        if(err) throw err;
                        callback(null, orderedSheets);
                    });
                }
            }
        }

    });
}