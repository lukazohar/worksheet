const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const sortModule = require('../modules/sheet/sheetSort');
const sheetTrim = require('../modules/sheet/sheetTrim');

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

module.exports.getSortedSheets = function(userID, sortType, order, limit, page, callback) {
    User.aggregate()
    .unwind("$sheets")
    .match({_id: ObjectId(userID)})
    .group({
        "_id": null,
        "sheets": { $push: "$sheets" },
        "noOfSheets": { $sum: 1 }
    })
    .project({
        _id: false,
        sheets: true,
        noOfSheets: true
    })
    .exec((err, result) => {
        if(err) throw err;
        if(result[0]) {
            console.log(sortType);
            switch(sortType) {
                case 'date' : {
                    if(order == 'ascending') {
                        console.log('date asc');
                        sortModule.orderSheetsByDateAscending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    } else {
                        console.log('date desc');
                        sortModule.orderSheetsByDateDescending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    }
                    break;
                };
                case 'priority' : {
                    if(order == 'ascending') {
                        console.log('priority asc');
                        sortModule.orderSheetsByPriorityAscending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    } else {
                        console.log('priority desc');
                        sortModule.orderSheetsByPriorityDescending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    }
                    break;
                }
                case 'status' : {
                    if(order == 'ascending') {
                        console.log('status asc');
                        sortModule.orderSheetsByStatusAscending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    } else {
                        console.log('status desc');
                        sortModule.orderSheetsByStatusDescending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    }
                    break;
                }
                case 'modified' : {
                    if(order == 'ascending') {
                        sortModule.orderSheetsBySheetmodifiedAscending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    } else {
                        sortModule.orderSheetsBySheetmodifiedDescending(result[0].sheets, (err, orderedSheets) => {
                            if(err) throw err;
                            result[0].sheets = orderedSheets;
                        });
                    }
                    break;
                }
                default: {
                    sortModule.orderSheetsByDateDescending(result[0].sheets, (err, orderedSheets) => {
                        if(err) throw err;
                        result[0].sheets = orderedSheets;
                    });
                }
            }
            sheetTrim.trimSheets(result[0].sheets, limit, page, (err, trimmedSheets) => {
                if(err) throw err;
                result[0].sheets = trimmedSheets;
            });
            callback(null, result);
        } else {
            callback(null, [{sheets: null, noOfSheets: 0, sheetsTitles: 0}])
        }
    });
}

module.exports.getQueryedSheets = function(userID, query, limit, page, callback) {
    User.aggregate()
    .unwind("$sheets")
    .match({$or: [
        { "sheets.title": {$regex: new RegExp(query, "ig")} }
    ]})
    .match({_id: ObjectId(userID)})
    .group({
        "_id": null,
        "sheets": { $push: "$sheets" },
        "sheetsTitles": { $push: "$sheets.title" },
        "noOfSheets": { $sum: 1 }
    })
    .project({
        _id: false,
        sheets: true,
        sheetsTitles: true,
        noOfSheets: true
    })
    .exec((err, result) => {
        if(err) throw err;
        if(result[0]) {
            sheetTrim.trimSheets(result[0].sheets, limit, page, (err, trimmedSheets) => {
                if(err) throw err;
                result[0].sheets = trimmedSheets;
            });
            callback(null, result);
        } else {
            callback(null, [{sheets: null, noOfSheets: 0, sheetsTitles: 0}])
        }
    });
}

module.exports.getQueryedTitles = function(userID, query, callback) {
}