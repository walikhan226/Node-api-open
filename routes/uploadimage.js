const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const { json } = require("express");
const multer = require("multer");
const object = require("joi/lib/types/object");
const router = express.Router();
var url = require("url");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    console.log(file);
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});

function validateinfo(post) {
  const schema = {
    id: Joi.objectId().required(),
  };
  return Joi.validate(post, schema);
}

const imageFilter = async function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }

  // console.log(file.path);
  cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter }).single(
  "file"
);

router.post("/", async (req, res) => {
  var body = {
    id: req.query.id,
  };

  const { error } = validateinfo(body);

  if (error) {
    return res.status(200).json({
      status: 0,
      message: error.message,
    });
  }

  let user = await User.findById(req.query.id);
  if (!user) {
    return res.status(400).json({ status: 0, message: "User not exist" });
  } else {
    console.log(user);
  }

  upload(req, res, async function (err) {
    if (req.fileValidationError) {
      return res.status(400).send(req.fileValidationError);
    } else if (!req.file) {
      return res.status(400).send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.status(400).send(err);
    } else if (err) {
      return res.status(400).send(err);
    }

    let image =
      req.protocol + "://" + req.headers.host + "/uploads/" + req.file.filename;
    user.image = image;

    await user.save();
    res.status(200).send(image);
  });
});

module.exports = router;
