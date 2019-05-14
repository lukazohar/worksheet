const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model('User', UserSchema.UserSchema);

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