const express = require("express");
const router = express.Router();

const authController = require('./../Controllers/user')
const checkAuth = require("./../Middlewares/checkAuth");

router.route('/signup').post(authController.signup);

router.route("/login").post(authController.login);

router.route("/forgotPassword").post(authController.forgotPassword);

router.route("/resetPassword/:token").patch(authController.resetPassword);

// router.route("/profile").get(checkAuth, (req, res) => res.status(200).json({ message: "Welcome to the profile page" }));

router.route("/updatePassword").patch(checkAuth, authController.updatePassword);

module.exports = router;