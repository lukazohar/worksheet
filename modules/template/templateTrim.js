const mongoose = require('mongoose');

module.exports.trimTemplates = function(templates, limit, page, callback) {
    const templatesLenght = templates.length;
    if (limit == 0) {
        callback(null, templates);
    } else {
        templates.splice(limit * page, templatesLenght - limit * page);
        templates.splice(0, limit * page - limit)
        callback(null, templates);
    }
}