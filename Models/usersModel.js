const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const shortid = require('shortid');


const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    rollnumber:{
        //type integer
        type : Number ,
        required: [true, 'Please enter your roll number.'],
        maxlength: [6, 'Roll number must be exactly 6 digits.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'committee'],
        default: 'student'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
})


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');         //hashing the reset token
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    
    console.log(resetToken, this.passwordResetToken, this.passwordResetTokenExpires);

    return resetToken;
}  

// userSchema.methods.createUserVerificationToken = function () {
//     const verificationToken = crypto.randomBytes(32).toString('hex');
//     this.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');         //hashing the verification token
//     this.verificationTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    
//     console.log(verificationToken, this.verificationToken, this.verificationTokenExpires);

//     return verificationToken;
// }

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model('User', userSchema);

module.exports = User;