const User = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const sendEmail = require('./../Utils/email')
const crypto = require('crypto');
const shortid = require('shortid');


const signToken = (user) => {
  return jwt.sign(
    { email: user.email, userId: user._id, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

const setJwtCookieAndSendResponse = (res, statusCode, msg, user) => {
  user.password=undefined
  const token = signToken(user);
  res.cookie('jwt', token, {
    maxAge: process.env.JWT_COOKIE_EXPIRES,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: false
  });

  // res.status(statusCode).json({
  //   message: msg,
  //   data: user,
  //   token: token,
  // });
};

exports.signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [
          { email: req.body.email },
          { rollnumber: req.body.rollnumber }
      ]
    });

    if (existingUser) {
      console.log("User already exists. Make sure correct details are entered!");
      return res.status(409).json({
        message: "User already exists. Make sure correct details are entered!",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      _id: shortid.generate().toString().toUpperCase(),
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      rollnumber: req.body.rollnumber
    });

    const result = await newUser.save();
    console.log(result);

    setJwtCookieAndSendResponse(res, 201, "User Created Successfully!", result);


    return res.redirect('dashboard');
    
    

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    if (passwordMatch) {
      setJwtCookieAndSendResponse(res, 201, "User Logged In successfully!", user);
      if(user.role === 'admin' || user.role === 'committee')
        return res.redirect('adminDash');
      else
        return res.redirect('dashboard');
    }

    return res.status(401).json({ message: "Login Failed!!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
      return res.status(404).json({ message: 'There is no user with that email.' });
  }

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  // You need to implement this function
  try {
      const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
      const message = `We have recieved a password rest request. Please use the below link to reset yout password\n\n${resetURL}\n\n This link will be valid for next 10 minutes only.`

      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request for MMS IITG Account',
        message: message
      });
      // alert('Check Mail')
      res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ status: 'error', message: 'There was an error sending the email. Try again later!' });
  }
};


exports.resetPassword = async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpires: { $gt: Date.now() } });

  // 2. If token has not expired, and there is user, set the new password
  if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password =  hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  // 4. Log the user in, send JWT
  setJwtCookieAndSendResponse(res, 200, "Password Reset Successfully!", user);
};


exports.updatePassword = async (req, res) => {
  try {
      // 1. Get user from collection
      const user = await User.findOne({ email: req.userData.email }).select('+password');
      console.log(user);
      // 2. Check if POSTed current password is correct
      if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
          return res.status(401).json({ message: 'Your current password is wrong.' });
      }

      // // 3. If so, update password
      user.password = await bcrypt.hash(req.body.password, 10);
      await user.save();

      // // 4. Log user in, send JWT
      setJwtCookieAndSendResponse(res, 200, "Password Updated Successfully!", user);

  } catch (error) {
      res.status(400).json({ message: "Something went wrong while updating the password.", error: error.message });
  }
};