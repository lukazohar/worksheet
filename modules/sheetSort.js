const moment = require('moment');

//
// For all algorithms, is used bubble sort
//

module.exports.orderSheetsByDateAscending = function(sheets, limit, page, callback) {
    // [Older -> Younger]
    let swapped = true;
    for (let i = 0; i < sheets.length; i++) {
        console.log(i);
        if(swapped) {
            // Resets swapped everytime there's a new comparison
            swapped = false;
            let dateLeft = sheets[i].sheetCreated;
            let dateRight = sheets[i+1].sheetCreated;
            if(moment(dateLeft).format('YYYY-MM-DDTHH:mm:ss').isAfter(dateRight)) {
                // If date of left sheet is after date of right sheet, sheets get swapped
                let leftSheet = sheets[i];
                console.log('Swapped');
                sheets[i] = sheets[i+1];
                sheets[i+1] = leftSheet;
    
                swapped = true;
            }
        } else {
            console.log('Over');
            callback(null, sheets);
        }
    }
}

module.exports.orderSheetsByDateDescending = function() {
    
}

module.exports.orderSheetsByPriorityAscending = function() {
    
}


module.exports.orderSheetsByPriorityDescending = function() {
    
}

module.exports.orderSheetsByStatusAscending = function() {
    
}

module.exports.orderSheetsByStatusDescending = function() {
    
}

module.exports.orderSheetsByUrgencyAscending = function() {
    
}

module.exports.orderSheetsByUrgencyAscending = function() {
    
}
