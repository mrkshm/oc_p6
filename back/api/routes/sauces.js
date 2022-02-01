const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../../middleware/auth");
const multer = require("../../middleware/multer-config");
const { sauceValidator } = require("../../middleware/validator.js");

router.post("/", auth, multer, sauceValidator, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceValidator, sauceCtrl.modifySauce);
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.get("/:id", sauceCtrl.getOneSauce);
router.get("/", sauceCtrl.getAllSauces);

module.exports = router;
