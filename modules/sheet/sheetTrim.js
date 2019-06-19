const mongoose = require('mongoose');

module.exports.trimSheets = function(sheets, limit, page, callback) {
    const sheetsLenght = sheets.length;
    if (limit == 0) {
        callback(null, sheets);
    } else {
        sheets.splice(limit * page, sheetsLenght - limit * page);
        sheets.splice(0, limit * page - limit)
        callback(null, sheets);
    }
}