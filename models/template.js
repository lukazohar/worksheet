const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model('User', UserSchema.UserSchema);

// Pushes new template to userTemplates array to user with ID userID
// Returns created template
module.exports.addTemplate = (newTemplate, userID, callback) => {
    User.findByIdAndUpdate(userID, {$push: {"userTemplates": newTemplate}}, { new: true }, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser.userTemplates[newUser.userTemplates.length - 1]);
    });
}

// Updates array at position of object with templateID
// Returns status of modification:
// n - number of found elemets
// nModified - number of modified documents
// ok - if thers's no error
module.exports.updateTemplate = (userId, templateId, editedTemplate, callback) => {
    User.updateOne({_id: ObjectId(userId), "userTemplates._id": ObjectId(templateId)}, {$set: {"userTemplates.$": editedTemplate}}, {new: true}, (err, modifiedStatus) => {
        if(err) throw err;
        console.log(modifiedStatus);
        callback(null, modifiedStatus);
    });
}

// Pulls array element (template) where templateID is found
module.exports.deleteTemplate = (userId, templateId, callback) => {
    User.findByIdAndUpdate(userId, {$pull: {"userTemplates": {_id: ObjectId(templateId)}}}, {new: true}, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser);
    });
}