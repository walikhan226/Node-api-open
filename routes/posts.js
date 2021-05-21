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
const auth = require("../middleware/auth");

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

router.post("/", auth, uploadImg, async (req, res, next) => {
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

    let post = new Posts({
      file: req.file,
      user: req.body.user,
      body: req.body.body,
      postType: req.body.postType,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
      },
    });

    post.image = req.file.path;
    await post.save();

    res
      .status(200)
      .send(_.pick(post, ["user", "postType", "location", "body", "image"]));
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

router.post("/", auth, async (req, res) => {

  let {error} = await validatedeletepost(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let post = Posts.deleteMany({ _id: req.body.postids });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

function validatedeletepost(post) {
  const schema = {
    postids: Joi.array().required(),
  };

  return Joi.validate(post, schema);
}

module.exports = router;
