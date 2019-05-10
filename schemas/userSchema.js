const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const UserSchema = Schema({
    userProfile: {
        username: { type: String, require: true },
        email: { type: String, require: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        created: { type: String, default: moment().format('DD.MM.YYYY HH:mm') },
        modified: { type: String, default: moment().format('DD.MM.YYYY HH:mm') },
        password: { type: String, require: true }
    },
    userSheets: [
        {
            templateTitle: { type: String },
            title: { type: String },
            description: { type: String, default: '' },
            created: { type: Date, default: moment().format('DD.MM.YYYY HH:mm') },
            modified: { type: Date, default: moment().format('DD.MM.YYYY HH:mm') },
            status: { type: String, default: 'Not started yet' },
            items: { type: Array }
        }
    ],
    userTemplates: [
        {
            title: { type: String },
            description: { type: String },
            items: { type: Array },
            created: { type: Date, default: moment().format('DD.MM.YYYY HH:mm') },
            modified: { type: Date, default: moment().format('DD.MM.YYYY HH:mm') }
        }
    ]
});

exports.UserSchema = UserSchema;