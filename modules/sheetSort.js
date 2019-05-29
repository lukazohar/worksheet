const moment = require('moment');

module.exports.orderSheetsByDateAscending = function(sheets, limit, page, callback) {
    // [Older -> Younger]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    let sheetsArr = [];
    sheets.forEach(sheet => {
        sheetsArr.push(sheet);
    });
    sheetsArr.sort((a, b) => {
        return moment(b.sheetCreated) - moment(a.sheetCreated);
    });
    // Reverses array, so dates are ascending
    sheetsArr.reverse();
    callback(null, sheetsArr);
}

module.exports.orderSheetsByDateDescending = function(sheets, limit, page, callback) {
    // [ Younger -> Older ]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    sheets.sort((a, b) => {
        return moment(b.sheetCreated) - moment(a.sheetCreated);
    });
    let sheetsArr = [];
    sheets.forEach(sheet => {
        sheetsArr.push(sheet);
    });
    callback(null, sheetsArr);
}

module.exports.orderSheetsByPriorityAscending = function(sheets, limit, page, callback) {
    let sortedSheetsLow = [];
    let sortedSheetsMedium = [];
    let sortedSheetsHigh = [];
    // Loops through array of all sheets
    sheets.forEach(sheet => {
        switch(sheet.priority) {
            // If priority is Low, it pushes to array of sortedSheetsLow
            case 'Low' : {
                sortedSheetsLow.push(sheet);
                break;
            };
            // If priority if Medium, it pushes to array of sortedSheetsMedium
            case 'Medium' : {
                sortedSheetsMedium.push(sheet);
                break;
            };
            // If priority is High, it pushes to array of sortedSheetsHigh
            case 'High' : {
                sortedSheetsHigh.push(sheet);
                break;
            };
            default : {
                sortedSheetsLow.push(sheet);
            }
        }
    });
    // Orders sheets is sortedSheetsHigh ascending
    exports.orderSheetsByDateAscending(sortedSheetsHigh, 0, 0, (err, orderedHighSheets) => {
        if(err) throw err;
        sortedSheetsHigh = orderedHighSheets;
    });
    // Orders sheets is sortedSheetsMedium ascending
    exports.orderSheetsByDateAscending(sortedSheetsMedium, 0, 0, (err, orderedMediumSheets) => {
        if(err) throw err;
        sortedSheetsMedium = orderedMediumSheets;
    });
    // Orders sheets is sortedSheetsLow ascending
    exports.orderSheetsByDateAscending(sortedSheetsLow, 0, 0, (err, orderedLowSheets) => {
        if(err) throw err;
        sortedSheetsLow = orderedLowSheets;
    });

    // Combines all sorted arrays, from high priority to low
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
    let sortedSheetsNotStartedYet = [];
    let sortedSheetsOnHold = [];
    let sortedSheetsInProgress = [];
    let sortedSheetsFinished = [];
    // Loops through array of all sheets
    sheets.forEach(sheet => {
        switch(sheet.status) {
            // If status is Not Started Yet, it pushes to array of sortedSheetsNotStartedYet
            case 'Not Started Yet' : {
                sortedSheetsNotStartedYet.push(sheet);
                break;
            };
            // If status if On Hold, it pushes to array of sortedSheetsOnHold
            case 'On Hold' : {
                sortedSheetsOnHold.push(sheet);
                break;
            };
            // If status is In Progress, it pushes to array of sortedSheetsInProgress
            case 'In Progress' : {
                sortedSheetsInProgress.push(sheet);
                break;
            };
            // If status if finished, it pushes to array of sortedSheetsFinished
            case 'Finished' : {
                sortedSheetsFinished.push(sheet);
                break;
            };
        }
    });
    // Orders sheets is sortedSheetsFinished ascending
    exports.orderSheetsByDateAscending(sortedSheetsFinished, 0, 0, (err, orderedHighSheets) => {
        if(err) throw err;
        sortedSheetsFinished = orderedHighSheets;
    });
    // Orders sheets is sortedSheetsInProgress ascending
    exports.orderSheetsByDateAscending(sortedSheetsInProgress, 0, 0, (err, orderedMediumSheets) => {
        if(err) throw err;
        sortedSheetsInProgress = orderedMediumSheets;
    });
    // Orders sheets is sortedSheetsOnHold ascending
    exports.orderSheetsByDateAscending(sortedSheetsOnHold, 0, 0, (err, orderedLowSheets) => {
        if(err) throw err;
        sortedSheetsOnHold = orderedLowSheets;
    });
    // Orders sheets is sortedSheetsNotStartedYet ascending
    exports.orderSheetsByDateAscending(sortedSheetsNotStartedYet, 0, 0, (err, orderedLowSheets) => {
        if(err) throw err;
        sortedSheetsNotStartedYet = orderedLowSheets;
    });

    // Combines all sorted arrays, from high priority to low
    let allSheetsSorted = sortedSheetsNotStartedYet.concat(sortedSheetsOnHold, sortedSheetsInProgress, sortedSheetsFinished);
    callback(null, allSheetsSorted);
}

module.exports.orderSheetsByStatusDescending = function(sheets, limit, page, callback) {
    let sortedSheetsNotStartedYet = [];
    let sortedSheetsOnHold = [];
    let sortedSheetsInProgress = [];
    let sortedSheetsFinished = [];
    // Loops through array of all sheets
    sheets.forEach(sheet => {
        switch(sheet.status) {
            // If priority if high, it pushes to array of sortedSheetsHigh
            case 'Not Started Yet' : {
                sortedSheetsNotStartedYet.push(sheet);
                break;
            };
            // If priority if medium, it pushes to array of sortedSheetsMedium
            case 'On Hold' : {
                sortedSheetsOnHold.push(sheet);
                break;
            };
            // If priority if low, it pushes to array of sortedSheetsLow
            case 'In Progress' : {
                sortedSheetsInProgress.push(sheet);
                break;
            };
            // If priority if low, it pushes to array of sortedSheetsLow
            case 'Finished' : {
                sortedSheetsFinished.push(sheet);
                break;
            };
        }
    });
    // Orders sheets is sortedSheetsFinished ascending
    exports.orderSheetsByDateDescending(sortedSheetsFinished, 0, 0, (err, orderedHighSheets) => {
        if(err) throw err;
        sortedSheetsFinished = orderedHighSheets;
    });
    // Orders sheets is sortedSheetsInProgress ascending
    exports.orderSheetsByDateDescending(sortedSheetsInProgress, 0, 0, (err, orderedMediumSheets) => {
        if(err) throw err;
        sortedSheetsInProgress = orderedMediumSheets;
    });
    // Orders sheets is sortedSheetsOnHold ascending
    exports.orderSheetsByDateDescending(sortedSheetsOnHold, 0, 0, (err, orderedLowSheets) => {
        if(err) throw err;
        sortedSheetsOnHold = orderedLowSheets;
    });
    // Orders sheets is sortedSheetsNotStartedYet ascending
    exports.orderSheetsByDateDescending(sortedSheetsNotStartedYet, 0, 0, (err, orderedLowSheets) => {
        if(err) throw err;
        sortedSheetsNotStartedYet = orderedLowSheets;
    });

    // Combines all sorted arrays, from high priority to low
    let allSheetsSorted = sortedSheetsFinished.concat(sortedSheetsInProgress, sortedSheetsOnHold, sortedSheetsNotStartedYet);
    callback(null, allSheetsSorted);
}

module.exports.orderSheetsBySheetmodifiedAscending = function(sheets, limit, page, callback) {
}

module.exports.orderSheetsBySheetmodifiedDescending = function(sheets, limit, page, callback) {

}