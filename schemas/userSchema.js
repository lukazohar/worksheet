const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    userProfile: {
        username: { type: String, require: true },
        email: { type: String, require: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        userCreated: { type: String, default: Date.now() },
        userModified: { type: String, default: Date.now() },
        password: { type: String, require: true }
    },
    userSheets: [
        {
            sheetName: { type: String },
            sheetDescription: { type: String, default: '' },
            sheetCreated: { type: Date, default: Date.now() },
            sheetModified: { type: String, default: Date.now() },
            status: { type: String, default: 'Not started yet' },
            statusChanged: { type: Date, default: Date.now() },
            sheetContent: {
                itemType: { type: String },
                itemRow: { type: Number },
                itemColumn: { type: Number },
                itemContent: { type: String, default: '' },
                itemDatatype: { type: String },
            }
        }
    ],
    userTemplates: [
        {
            templateName: { type: String },
            templateDescription: { type: String, default: '' },
            templateCreated: { type: Date, default: Date.now() },
            templateModified: { type: Date, default: Date.now() },
            templateContent: [
                {
                    templateItemType: { type: String },
                    templateItemRow: { type: Number },
                    templateItemColumn: { type: Number },
                    templateItemContent: { type: String },
                    templateItemDatatype: { type: String },
                }
            ]
        }
    ]
});

exports.UserSchema = UserSchema;