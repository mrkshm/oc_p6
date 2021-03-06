const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { userValidator } = require("../../middleware/validator.js");

router.post("/signup", userValidator, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
