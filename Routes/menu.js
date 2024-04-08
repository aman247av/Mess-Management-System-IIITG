const express = require("express");
const router = express.Router();

const menuController = require('../Controllers/menu')
const checkAuth = require("./../Middlewares/checkAuth");
const checkPermission = require("./../Middlewares/permission");

router.route('/createMenu').post(checkAuth, checkPermission(["admin"]), menuController.createMenu);

router.route("/changeMenu/:day").put(checkAuth, checkPermission(["admin", "committee"]), menuController.updateMenuByDay);

router.route('/showMenu').get(menuController.showMenu);

router.route("/showMenu/:day").get(menuController.findMenuByDay);

module.exports = router;