const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const auth = require("../../middleware/auth");
const multer = require("../../middleware/multer-config");

const {
  sauceValidationRules,
  validate
} = require("../../middleware/validator.js");

// post('/)... should looke like this, but does not work yet:
// router.post("/", auth, multer, sauceValidationRules(), validate, sauceCtrl.createSauce);
// in the meantime the route without validation
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.get("/:id", sauceCtrl.getOneSauce);
router.get("/", sauceCtrl.getAllSauces);

module.exports = router;
