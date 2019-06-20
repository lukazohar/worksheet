const moment = require('moment');

module.exports.orderTemplatesByDateAscending = function(templates, callback) {
    // [Older -> Younger]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    let templatesArr = [];
    templates.forEach(template => {
        templatesArr.push(template);
    });
    templatesArr.sort((a, b) => {
        return moment(b.created) - moment(a.created);
    });
    // Reverses array, so dates are ascending
    templatesArr.reverse();
    callback(null, templatesArr);
}

module.exports.orderTemplatesByDateDescending = function(templates, callback) {
    // [ Younger -> Older ]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    templates.sort((a, b) => {
        return moment(b.created) - moment(a.created);
    });
    let templatesArr = [];
    templates.forEach(template => {
        templatesArr.push(template);
    });
    callback(null, templatesArr);
}

module.exports.orderTemplatesByModifiedAscending = function(templates, callback) {// [Older -> Younger]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    let templatesArr = [];
    templates.forEach(template => {
        templatesArr.push(template);
    });
    templatesArr.sort((a, b) => {
        return moment(b.modified) - moment(a.modified);
    });
    // Reverses array, so dates are ascending
    templatesArr.reverse();
    callback(null, templatesArr);
}

module.exports.orderTemplatesByModifiedDescending = function(templates, callback) {// [ Younger -> Older ]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    templates.sort((a, b) => {
        return moment(b.modified) - moment(a.modified);
    });
    let templatesArr = [];
    templates.forEach(template => {
        templatesArr.push(template);
    });
    callback(null, templatesArr);

}