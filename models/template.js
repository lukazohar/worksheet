const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model('User', UserSchema.UserSchema);

module.exports.addTemplate = (newTemplate, userID, callback) => {
    User.findByIdAndUpdate(userID, {$push: {"userTemplates": newTemplate.userTemplates}}, { new: true }, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser.userTemplates[newUser.userTemplates.length - 1]);
    });
}

module.exports.updateTemplate = (userId, templateId, editedTemplate, callback) => {
    User.updateOne({_id: ObjectId(userId), "userTemplates._id": ObjectId(templateId)}, {$set: {"userTemplates.$": editedTemplate}}, {new: true}, (err, modifiedStatus) => {
        if(err) throw err;
        callback(null, modifiedStatus);
    });
}

module.exports.deleteTemplate = (userId, templateId, callback) => {
    User.findByIdAndUpdate(userId, {$pull: {"userTemplates": {_id: ObjectId(templateId)}}}, {new: true}, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser);
    });
}