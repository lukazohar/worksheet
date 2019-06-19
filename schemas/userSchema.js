const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

// User schema
const UserSchema = Schema({
    profile: {
        username: { type: String, require: true },
        email: { type: String, require: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        created: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
        modified: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
        password: { type: String, require: true }
    },
    sheets: [
        {
            templateTitle: { type: String },
            title: { type: String },
            description: { type: String, default: '' },
            sheetCreated: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
            sheetModified: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
            status: { type: String, default: 'Not Started Yet' },
            statusModified: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
            priority: { type: String, default: 'Low' },
            priorityModified: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
            items: { type: Array }
        }
    ],
    templates: [
        {
            title: { type: String },
            description: { type: String },
            templateCreated: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
            templateModified: { type: String, default: moment().format('YYYY-MM-DDTHH:mm:ss') },
            items: { type: Array },
        }
    ]
});

exports.UserSchema = UserSchema;