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
const { Posts, validate } = require("../models/posts");

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

const uploadImg = multer({ storage: storage }).single("file");

async function createuser(file, user, postType, latitude, logitude) {
  let post = new Posts({
    file,
    user,
    postType,
    latitude,
    logitude,
  });

  await post.save();
}

router.post("/", uploadImg, async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!req.file) {
      const error = new Error("Please choose files");
      error.httpStatusCode = 400;

      console.log(error);
      return next(error);
    }
    let user = await User.findById(req.body.user);
    console.log(user);
    if (!user) return res.status(400).send("Invalid User");

    let post = new Posts(
      _.pick(req.body, ["user", "body", "postType", "latitude", "longitude"])
    );

    post.image = req.file.path;
    await post.save();

    res
      .status(200)
      .send(
        _.pick(post, [
          "user",
          "postType",
          "latitude",
          "longitude",
          "body",
          "image"
          
        ])
      );
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

module.exports = router;
