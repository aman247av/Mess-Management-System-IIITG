const mongoose = require('mongoose');
const User = require("../Models/usersModel");
const shortid = require('shortid');

const complaintSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    user: {
        type: String,
        ref: User,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'InProgress', 'Resolved'],
        default: 'Pending'
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Not Reviewed'],
        default: 'Not Reviewed'
    },
    assignedTo: {
        type: String,
        enum: ['Committee', 'Admin'],
        default: 'Committee'
    },
    photo: {
        type: String
    },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
