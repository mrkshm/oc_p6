const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../../middleware/auth");
const multer = require("../../middleware/multer-config");
const { sauceValidator } = require("../../middleware/validator.js");
const ownsSauce = require("../../middleware/permissions");
const errorCatcher = require("../../middleware/errorCatcher");

router.post(
  "/",
  auth,
  multer,
  errorCatcher,
  sauceValidator,
  sauceCtrl.createSauce
);
router.put(
  "/:id",
  auth,
  ownsSauce,
  multer,
  errorCatcher,
  sauceValidator,
  sauceCtrl.modifySauce
);
router.delete("/:id", auth, ownsSauce, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router;
