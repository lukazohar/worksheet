const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');

const User = mongoose.model('User', UserSchema.UserSchema);

module.exports.setupTemplate = function (template) {
    
}

module.exports.addTemplate = function(newTemplate, userID, callback) {
    User.findByIdAndUpdate(userID, {$push: {"userTemplates": newTemplate.userTemplates}}, (err, newUser) => {
        if(err) throw err;
        callback(null, newUser);
    });
}
