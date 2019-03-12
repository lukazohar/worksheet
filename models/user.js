const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const UserSchema = require('../schemas/userSchema');

const User = module.exports = mongoose.model('User', UserSchema.UserSchema);

// Finds user by ID
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

// Finds user by username
module.exports.getUserByUsername = function (username, callback) {
    User.findOne({"userProfile.username": username}, callback);
};

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.userProfile.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.userProfile.password = hash;
            newUser.save();
            callback(null, newUser);
        })
    })
};

module.exports.comparePasswords = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

module.exports.areUsernameAndEmailAvailable = function(username, email, id = 0, callback) {
    // Function returns: - success status and - message
    // Counts documents, where username already exists
    User.countDocuments({"userProfile.username": username}).where({"_id": {"$ne": id}}).exec((err, num) => {
        if(err) throw err;
        if(num > 0) {
            callback(null, {
                success: false,
                msg: "Username is already taken"
            });
        }
        if(num == 0) {
            // Counts documents, where email already exists
            User.countDocuments({"userProfile.email": email}).where({"_id": {"$ne": id}}).exec((err, num) => {
                if(err) throw err;
                if(num > 0) {
                    callback(null, {
                        success: false,
                        msg: "Email is already in use"
                    });
                }
                // It comes to this point if username and email are available, return success
                if(num === 0) {
                    callback(null, {
                        success: true,
                        msg: "Username and email are available"
                    });
                }
            }); 
        }
    });
}

module.exports.updateUser = function(id, updatedUser, callback) {
    var options = {
        new: true
    };
    console.log(updatedUser.userProfile);
    User.findByIdAndUpdate(id, updatedUser, options, (err, userAll) => {
        if(err) throw err;
        const user = {
            success: true,
            userProfile: userAll.userProfile
        };
        callback(null, user);
    });
}

module.exports.deleteUser = function (userID, callback) {
    User.findByIdAndRemove(userID, (err, idk) => {
        if(err) throw err;
        callback(null, idk);
    })
}