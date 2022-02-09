const res = require("express/lib/response");
const req = require("express/lib/request");

const multer = require("multer");
const path = require("path");
const { nextTick } = require("process");
const { MulterError } = require("multer");
const { Promise } = require("mongoose");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png"
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    let name = path.parse(file.originalname).name.split(" ").join("_");
    if (name.length > 30) {
      name = name.substring(0, 29);
    }
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + "_" + Date.now() + "." + extension);
  }
});

module.exports = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 }
}).single("image");
