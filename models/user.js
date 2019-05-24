const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const UserSchema = require('../schemas/userSchema');
const passGen = require('generate-password');
const nodeMailer = require('nodemailer');
const ObjectId = mongoose.Types.ObjectId

const User = module.exports = mongoose.model('User', UserSchema.UserSchema);

// Finds user by ID and returns it
module.exports.getUserById = function (id, callback) {
    User.findById(id, (err, user) => {
        if(err) throw err;
        callback(null, callback);
    });
};

// Finds user by username and returns it
module.exports.getUserByUsername = function (username, callback) {
    User.findOne({"profile.username": username}, callback);
};

// Adds user with hashed and salted password to database
module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.profile.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.profile.password = hash;
            newUser.save();
            callback(null, newUser);
        })
    })
};

// Compares hashed and string password and returns if there's a match
module.exports.comparePasswords = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

// Updates profile and returns updated user
module.exports.updateUser = function(userID, updatedUser, callback) {
    User.findByIdAndUpdate(userID, updatedUser, {new: true}, (err, newUser) => {
        if(err) throw err;
        const user = {
            success: true,
            profile: newUser.profile
        };
        callback(null, user);
    });
}

// Returns true if username is available, false if it isn't
// If userID is given, it searches only in that document (faster), otherwise in all documents
// Returns true if there's no document with given username, otherwise false
module.exports.isUsernameAvailable = function(username, userID = 0, callback) {
    if (userID !== 0) {
        User.countDocuments()
            .where("_id").ne(ObjectId(userID))
            .where("profile.username").equals(username)
            .exec((err, num) => {
                if(err) throw err;
                if(num > 0) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
    } else {
        User.countDocuments()
            .where("profile.username").equals(username)
            .exec((err, num) => {
                if(err) throw err;
                if(num > 0) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
    }
}

// Returns true if email is available, false if it isn't
// If userID is given, it searches only in that document (faster), otherwise in all documents
// Returns true if there's no document with given email, otherwise false
module.exports.isEmailAvailable = function(email, userID = 0, callback) {
    if (userID !== 0) {
        User.countDocuments()
            .where("_id").ne(ObjectId(userID))
            .where("profile.email").equals(email)
            .exec((err, num) => {
                if(err) throw err;
                if(num > 0) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
    } else {
        User.countDocuments()
            .where("profile.email").equals(email)
            .exec((err, num) => {
                if(err) throw err;
                if(num > 0) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
    }
}

// Counts documents with username and email equal to ones in parameters
// Returns true if any is found, otherwise false with message which one is missing
module.exports.areUsernameAndEmailAvailable = function(username, email, userID = 0, callback) {
    // Function returns: - success status and - message
    // Counts documents, where username already exists
    User.countDocuments({"profile.username": username})
        .where("_id")
        .ne(userID)
        .exec((err, num) => {
            if(err) throw err;
            if(num > 0) {
                callback(null, {
                    success: false,
                    msg: "Username is already taken"
                });
            }
            if(num == 0) {
                // Counts documents, where email already exists
                User.countDocuments({"profile.email": email})
                    .where("_id")
                    .ne(userID)
                    .exec((err, num) => {
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

// Deletes document with userID
// Returns all data of deleted user
module.exports.deleteUser = function (userID, callback) {
    User.findByIdAndRemove(userID, {new: true}, (err, deletedUser) => {
        if(err) throw err;
        callback(null, deletedUser);
    })
}

//
// Send email for email reseting
//
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
        from: '',
        to: "",
        subject: '',
        text: ': ' + newPassword
    };
    let info = await transporter.sendMail(mailInfo);
}