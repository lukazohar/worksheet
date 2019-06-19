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
        return moment(b.templateCreated) - moment(a.templateCreated);
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
        return moment(b.templateCreated) - moment(a.templateCreated);
    });
    let templatesArr = [];
    templates.forEach(template => {
        templatesArr.push(template);
    });
    callback(null, templatesArr);
}

module.exports.orderTemplatesByTemplatemodifiedAscending = function(templates, callback) {// [Older -> Younger]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    let templatesArr = [];
    templates.forEach(template => {
        templatesArr.push(template);
    });
    templatesArr.sort((a, b) => {
        return moment(b.templateModified) - moment(a.templateModified);
    });
    // Reverses array, so dates are ascending
    templatesArr.reverse();
    callback(null, templatesArr);
}

module.exports.orderTemplatesByTemplatemodifiedDescending = function(templates, callback) {// [ Younger -> Older ]
    // Older = bigger
    // Yonger = smaller
    // Array.sort function
    templates.sort((a, b) => {
        return moment(b.templateModified) - moment(a.templateModified);
    });
    let templatesArr = [];
    templates.forEach(template => {
        templatesArr.push(template);
    });
    callback(null, templatesArr);

}