const moment = require('moment');

module.exports.orderSheetsByDateAscending = function(sheets, limit, page, callback) {
    // [Older -> Younger]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    sheets.sort((a, b) => {
        return moment(b.sheetCreated) - moment(a.sheetCreated);
    });
    // Reverses array, so dates are ascending
    sheets.reverse();
    callback(null, sheets);
}

module.exports.orderSheetsByDateDescending = function(sheets, limit, page, callback) {
    // [ Younger -> Older ]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    sheets.sort((a, b) => {
        return moment(b.sheetCreated) - moment(a.sheetCreated);
    });
    callback(null, sheets);
}

module.exports.orderSheetsByPriorityAscending = function(sheets, limit, page, callback) {
    // 3 arrays for every group of priority types
    let sortedSheetsHigh = [];
    let sortedSheetsMedium = [];
    let sortedSheetsLow = [];
    // Loops through array of all sheets
    sheets.forEach(sheet => {
        switch(sheet.priority) {
            // If priority if high, it pushes to array of sortedSheetsHigh
            case 'High' : {
                sortedSheetsHigh.push(sheet);
                break;
            };
            // If priority if medium, it pushes to array of sortedSheetsMedium
            case 'Medium' : {
                sortedSheetsMedium.push(sheet);
                break;
            };
            // If priority if low, it pushes to array of sortedSheetsLow
            case 'Low' : {
                sortedSheetsLow.push(sheet);
                break;
            };
        }
    });
    // Orders sheets is sortedSheetsHigh ascending
    exports.orderSheetsByDateAscending(sortedSheetsHigh, 0, 0, (err, ordered) => {
        if(err) throw err;
        return ordered;
    });
    // Orders sheets is sortedSheetsMedium ascending
    exports.orderSheetsByDateAscending(sortedSheetsMedium, 0, 0, (err, ordered) => {
        if(err) throw err;
        return ordered;
    });
    // Orders sheets is sortedSheetsLow ascending
    exports.orderSheetsByDateAscending(sortedSheetsLow, 0, 0, (err, ordered) => {
        if(err) throw err;
        return ordered;
    });

    // Combines all sorted arrays, from low priority to high
    let allSheetsSorted = sortedSheetsLow.concat(sortedSheetsMedium, sortedSheetsHigh);
    callback(null, allSheetsSorted);
}

module.exports.orderSheetsByPriorityDescending = function(sheets, limit, page, callback) {
    let sortedSheetsHigh = [];
    let sortedSheetsMedium = [];
    let sortedSheetsLow = [];
    // Loops through array of all sheets
    sheets.forEach(sheet => {
        switch(sheet.priority) {
            // If priority if high, it pushes to array of sortedSheetsHigh
            case 'High' : {
                sortedSheetsHigh.push(sheet);
                break;
            };
            // If priority if medium, it pushes to array of sortedSheetsMedium
            case 'Medium' : {
                sortedSheetsMedium.push(sheet);
                break;
            };
            // If priority if low, it pushes to array of sortedSheetsLow
            case 'Low' : {
                sortedSheetsLow.push(sheet);
                break;
            };
        }
    });
    // Orders sheets is sortedSheetsHigh descending
    exports.orderSheetsByDateDescending(sortedSheetsHigh, 0, 0, (err, orderedHighSheets) => {
        if(err) throw err;
        sortedSheetsHigh = orderedHighSheets;
    });
    // Orders sheets is sortedSheetsMedium descending
    exports.orderSheetsByDateDescending(sortedSheetsMedium, 0, 0, (err, orderedMediumSheets) => {
        if(err) throw err;
        sortedSheetsMedium = orderedMediumSheets;
    });
    // Orders sheets is sortedSheetsLow descending
    exports.orderSheetsByDateDescending(sortedSheetsLow, 0, 0, (err, orderedLowSheets) => {
        if(err) throw err;
        sortedSheetsLow = orderedLowSheets;
    });

    // Combines all sorted arrays, from high priority to low
    let allSheetsSorted = sortedSheetsHigh.concat(sortedSheetsMedium, sortedSheetsLow);
    callback(null, allSheetsSorted);
}

module.exports.orderSheetsByStatusAscending = function(sheets, limit, page, callback) {
    
}

module.exports.orderSheetsByStatusDescending = function(sheets, limit, page, callback) {
    
}