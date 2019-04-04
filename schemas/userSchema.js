const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    userProfile: {
        username: { type: String, require: true },
        email: { type: String, require: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        created: { type: Date, default: Date.now() },
        modified: { type: Date, default: Date.now() },
        password: { type: String, require: true }
    },
    userSheets: [
        {
            templateTitle: { type: String },
            title: { type: String },
            description: { type: String, default: '' },
            created: { type: Date, default: Date.now() },
            modified: { type: Date, default: Date.now() },
            status: { type: String, default: 'Not started yet' },
            items: { type: Array }
        }
    ],
    userTemplates: [
        {
            title: { type: String },
            description: { type: String },
            items: { type: Array },
            created: { type: Date, default: Date.now() },
            modified: { type: Date, default: Date.now() }
        }
    ]
});

exports.UserSchema = UserSchema;