const express = require("express");
const router = express.Router();


const checkAuth = require("./../Middlewares/checkAuth");
const complaintController = require("./../Controllers/complaint")
const upload = require('./../Middlewares/multer');
const checkPermission = require("./../Middlewares/permission");

router.route('/createComplaint').post(checkAuth, upload.single('photo'), complaintController.createComplaint);

router.route('/showComplaints').get(checkAuth, complaintController.showComplaint);

router.route('/updateComplaint/:id').patch(checkAuth, checkPermission(["admin", "committee"]), complaintController.updateComplaint);

router.route('/deleteComplaint/:id').delete(checkAuth, complaintController.deleteComplaint);

// router.route('/createComplaint').post(checkAuth, upload.single('photo'), complaintController.createComplaint);

// router.route('/createComplaint').post(checkAuth, upload.single('photo'), complaintController.createComplaint);

module.exports = router;