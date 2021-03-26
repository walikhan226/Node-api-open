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

var storage = multer.diskStorage({
  destination: (req, file, cb) => {

    console.log(file);
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file);
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


function validate(req) {
  const schema = {
    image: Joi.string().min(5).max(255).required().email(),
  };

  return Joi.validate(req, schema);
}
const uploadImg = multer({ storage: storage }).single("file");

router.post("/", uploadImg, async (req, res, next) => {
  try {

    if (!req.file) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      
      return next(error);
  }
    let user = await User.findById(req.body.id);

    if (!user) return res.status(400).send("Invalid User");

    console.log(user);
    user.image = req.file.path;

    const result = await user.save();
    console.log(result);

    return res.status(200).json({
      status: 1,
      fileUrl:  req.file.path
    });
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

module.exports = router;
