const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const UserSchema = require('../schemas/userSchema');
const passGen = require('generate-password');
const nodeMailer = require('nodemailer');

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

// Returns true if username is available, false if it isn't. Id for excluding documents is optional
module.exports.isUsernameAvailable = function(userID = 0, username, callback) {
    if (userID !== 0) {
        User.countDocuments({"userProfile.username": username}).where({"_id": {"$ne": userID}}).exec((err, num) => {
            if(err) throw err;
            console.log(num);
            if(num > 0) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        })
    } else {
        User.countDocuments({"userProfile.username": username}).exec((err, num) => {
            if(err) throw err;
            if(num > 0) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        })
    }
}

// Returns true if email is available, false if it isn't. Id for excluding documents is optional
module.exports.isEmailAvailable = function(userID = 0, email, callback) {
    if (userID !== 0) {
        User.countDocuments({"userProfile.email": email}).where({"_id": {"$ne": userID}}).exec((err, num) => {
            if(err) throw err;
            if(num > 0) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        })
    } else {
        User.countDocuments({"userProfile.email": email}).exec((err, num) => {
            if(err) throw err;
            if(num > 0) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        })
    }
}

module.exports.areUsernameAndEmailAvailable = function(username, email, userID = 0, callback) {
    // Function returns: - success status and - message
    // Counts documents, where username already exists
    User.countDocuments({"userProfile.username": username}).where({"_id": {"$ne": userID}}).exec((err, num) => {
        if(err) throw err;
        if(num > 0) {
            callback(null, {
                success: false,
                msg: "Username is already taken"
            });
        }
        if(num == 0) {
            // Counts documents, where email already exists
            User.countDocuments({"userProfile.email": email}).where({"_id": {"$ne": userID}}).exec((err, num) => {
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

module.exports.updateUser = function(userID, updatedUser, callback) {
    var options = {
        new: true
    };
    console.log(updatedUser.userProfile);
    User.findByIdAndUpdate(userID, updatedUser, options, (err, userAll) => {
        if(err) throw err;
        const user = {
            success: true,
            userProfile: userAll.userProfile
        };
        callback(null, user);
    });
}

module.exports.deleteUser = function (userID, callback) {
    User.findByIdAndRemove(userID, {new: true}, (err, idk) => {
        if(err) throw err;
        console.log(idk);
        callback(null, idk);
    })
}

module.exports.resetPassword = async function(userID, callback) {
    let newPassword = passGen.generate({
        length: 10,
        numbers: true,
        symbols: true,
        uppercase: true
    });
    const testACC = await nodeMailer.createTestAccount();
    const transporter = nodeMailer.createTransport({
        auth: {
            user: testACC.user,
            pass: testACC.pass
        }
    });
    const mailInfo = {
        from: '"Luka Žohar" <luka.zohi@test.com>',
        to: "t1402036@nwytg.net",
        subject: 'Send email for node test',
        text: 'Test succeded, pass: ' + newPassword
    };
    let info = await transporter.sendMail(mailInfo);
}