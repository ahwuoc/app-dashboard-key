import mongoose, { Schema, model, models } from 'mongoose';

// Key Schema
const keySchema = new Schema({
    key: { type: String, unique: true, required: true },
    hwid: { type: String },
    status: { type: String, default: 'active' },
    expiresAt: { type: Date, required: true },
    ip: { type: String },
    note: { type: String },
    shortLink: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Version Schema
const versionSchema = new Schema({
    version: { type: String, required: true },
    url: { type: String, required: true },
    note: { type: String },
    sha512: { type: String },
    size: { type: Number },
    updatedAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });


// Request Log Schema
const requestLogSchema = new Schema({
    ip: { type: String },
    endpoint: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// User Schema
const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Key Request Schema
const keyRequestSchema = new Schema({
    requestId: { type: String, unique: true, required: true },
    ip: { type: String, required: true },
    status: { type: String, default: 'PENDING' },
    shortLink: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });


export const Key = models.Key || model('Key', keySchema);
export const Version = models.Version || model('Version', versionSchema);
export const RequestLog = models.RequestLog || model('RequestLog', requestLogSchema);
export const User = models.User || model('User', userSchema);
export const KeyRequest = models.KeyRequest || model('KeyRequest', keyRequestSchema);
