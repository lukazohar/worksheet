const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;
const sortModule = require('../modules/template/templateSort')
const templateTrim = require('../modules/template//templateTrim')

const User = mongoose.model('User', UserSchema.UserSchema);

module.exports.getTemplate = function(userID, templateID, callback) {
    User.aggregate()
    .unwind("$templates")
    .match({"templates._id": ObjectId(templateID)})
    .group({
        "_id": null,
        "template": { $push: "$templates" }
    })
    .exec((err, template) => {
        if(err) throw err;
        callback(null, template);
    })
}


// Pushes new template to templates array to user with ID userID
// Returns created template
module.exports.addTemplate = (newTemplate, userID, callback) => {
    User.findByIdAndUpdate(userID, {$push: {"templates": newTemplate}}, { new: true }, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser.templates[newUser.templates.length - 1]);
    });
}

// Updates array at position of object with templateID
// Returns status of modification:
// n - number of found elemets
// nModified - number of modified documents
// ok - if thers's no error
module.exports.updateTemplate = (userId, templateId, editedTemplate, callback) => {
    User.updateOne({_id: ObjectId(userId), "templates._id": ObjectId(templateId)}, {$set: {"templates.$": editedTemplate}}, {new: true}, (err, modifiedStatus) => {
        if(err) throw err;
        callback(null, modifiedStatus);
    });
}

// Pulls array element (template) where templateID is found
module.exports.deleteTemplate = (userId, templateId, callback) => {
    User.findByIdAndUpdate(userId, {$pull: {"templates": {_id: ObjectId(templateId)}}}, {new: true}, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser);
    });
}

module.exports.getSortedTemplates = function(userID, sortType, order, limit, page, callback) {
    User.aggregate()
    .unwind("$templates")
    .match({_id: ObjectId(userID)})
    .group({
        "_id": null,
        "templates": { $push: "$templates" },
        "noOfTemplates": { $sum: 1 }
    })
    .project({
        _id: false,
        templates: true,
        noOfTemplates: true
    })
    .exec((err, result) => {
        if(err) throw err;
        if(result[0]) {
            switch(sortType) {
                case 'date' : {
                    if(order == 'ascending') {
                        sortModule.orderTemplatesByDateAscending(result[0].templates, (err, orderedTemplates) => {
                            if(err) throw err;
                            result[0].templates = orderedTemplates;
                        });
                    } else {
                        sortModule.orderTemplatesByDateDescending(result[0].templates, (err, orderedTemplates) => {
                            if(err) throw err;
                            result[0].templates = orderedTemplates;
                        });
                    }
                    break;
                };
                case 'modified' : {
                    if(order == 'ascending') {
                        sortModule.orderTemplatesByModifiedAscending(result[0].templates, (err, orderedTemplates) => {
                            if(err) throw err;
                            result[0].templates = orderedTemplates;
                        });
                    } else {
                        sortModule.orderTemplatesByModifiedDescending(result[0].templates, (err, orderedTemplates) => {
                            if(err) throw err;
                            result[0].templates = orderedTemplates;
                        });
                    }
                    break;
                }
                default: {
                    sortModule.orderTemplatesByDateDescending(result[0].templates, (err, orderedTemplates) => {
                        if(err) throw err;
                        result[0].templates = orderedTemplates;
                    });
                }
            }
            templateTrim.trimTemplates(result[0].templates, limit, page, (err, trimmedTemplates) => {
                if(err) throw err;
                result[0].templates = trimmedTemplates;
            });
            callback(null, result);
        } else {
            callback(null, [{templates: null, noOfTemplates: 0, templatesTitles: 0}])
        }
    });
}

module.exports.getQueryedTemplates = function(userID, query, limit, page, callback) {
    User.aggregate()
    .unwind("$templates")
    .match({$or: [
        { "templates.title": {$regex: new RegExp(query, "ig")} }
    ]})
    .match({_id: ObjectId(userID)})
    .group({
        "_id": null,
        "templates": { $push: "$templates" },
        "templatesTitles": { $push: "$templates.title" },
        "noOfTemplates": { $sum: 1 }
    })
    .project({
        _id: false,
        templates: true,
        templatesTitles: true,
        noOfTemplates: true
    })
    .exec((err, result) => {
        if(err) throw err;
        if(result[0]) {
            templateTrim.trimTemplates(result[0].templates, limit, page, (err, trimmedTemplates) => {
                if(err) throw err;
                result[0].templates = trimmedTemplates;
            });
            callback(null, result);
        } else {
            callback(null, [{templates: null, noOfTemplates: 0, templatesTitles: 0}])
        }
    });
}

module.exports.getQueryedTemplates = function(userID, query, limit, page, callback) {
    User.aggregate()
    .unwind("$templates")
    .match({$or: [
        { "templates.title": {$regex: new RegExp(query, "ig")} }
    ]})
    .match({_id: ObjectId(userID)})
    .group({
        "_id": null,
        "templates": { $push: "$templates" },
        "templatesTitles": { $push: "$templates.title" },
        "noOfTemplates": { $sum: 1 }
    })
    .project({
        _id: false,
        templates: true,
        templatesTitles: true,
        noOfTemplates: true
    })
    .exec((err, result) => {
        if(err) throw err;
        if(result[0]) {
            templateTrim.trimTemplates(result[0].templates, limit, page, (err, trimmedTemplates) => {
                if(err) throw err;
                result[0].templates = trimmedTemplates;
            });
            callback(null, { templates: result[0].templates, noOfTemplates: result[0].noOfTemplates, templatesTitles: result[0].templatesTitles });
        } else {
            callback(null, [{templates: null, noOfTemplates: 0, templatesTitles: 0}])
        }
    });
}