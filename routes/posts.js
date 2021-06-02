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

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
  //  console.log(file);
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

router.post("/", auth, async (req, res) => {
  console.log(req.query.body);
  try {
    let data = {
      user: req.query.user,
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      body: req.query.body,
      postType: req.query.postType,
    };
    console.log(data);
    const { error } = validate(data);
    if (error)
      return res.status(400).json({
        status: 0,

        message: error.details[0].message,
      });

    let user = await User.findById(data.user);

    if (!user)
      return res.status(400).json({
        status: 0,

        message: "Invalid user",
      });
    if (req.query.postType === "image") {
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
          req.protocol +
          "://" +
          req.headers.host +
          "/uploads/" +
          req.file.filename;
        user.image = image;
console.log(image);
        let post = new Posts({
          file: image,
          user: req.query.user,
          body: req.query.body,
          postType: req.query.postType,
          location: {
            type: "Point",
            coordinates: [
              parseFloat(req.query.longitude),
              parseFloat(req.query.latitude),
            ],
          },
        });

        post.image = image;
        await post.save();

        return res.status(200).send(post);
      });
      return;
    }

    let post = new Posts({
      file: req.file,
      user: req.query.user,
      body: req.query.body,
      postType: req.query.postType,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(req.query.longitude),
          parseFloat(req.query.latitude),
        ],
      },
    });

    post.image = "";
    await post.save();

    res
      .status(200)
      .send(_.pick(post, ["user", "postType", "location", "body", "image"]));
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

module.exports = router;
