const express = require("express");
const { json } = require("express");

const mongoose = require("mongoose");

const { Comments } = require("../models/comments");
const { Posts } = require("../models/posts");
const Joi = require("joi");
const { User } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  let { error } = validatecomment(req.body);

  if (error) {
    return res.status(200).json({
      status: 0,
      message: error.message,
    });
  }

  let user = await User.findOne({ _id: req.body.userid });
  if (!user) {
    return res.status(400).json({ status: 0, message: "User does not exist" });
  }
  let post = await Posts.findOne({ _id: req.body.postid });

  if (!post) {
    return res.status(400).json({ status: 0, message: "Post does not exist" });
  }
  try {
    let comment = await Comments({
      body: req.body.body,
      user: req.body.userid,
      post: req.body.postid,
    });
    await comment.save();
    return res
      .status(200)
      .json({ status: 1, message: "Sucess", data: comment });
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

router.post("/delete/single", async (req, res) => {
  let { error } = validatedelete(req.body);

  if (error) {
    return res.status(200).json({
      status: 0,
      message: error.message,
    });
  }

  try {
    let comment = await Comments.findByIdAndRemove(req.body.commentid);

    return res
      .status(200)
      .json({ status: 1, message: "Sucess", data: comment });
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

router.post("/delete/many", async (req, res) => {
  let { error } = validatedeletemany(req.body);

  if (error) {
    return res.status(200).json({
      status: 0,
      message: error.message,
    });
  }

  try {
    let comment = await Comments.deleteMany({ _id: req.body.commentids });

    return res
      .status(200)
      .json({ status: 1, message: "Sucess", data: comment });
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

function validatedeletemany(comment) {
  const schema = {
    commentids: Joi.array().required(),
  };

  return Joi.validate(comment, schema);
}

function validatedelete(comment) {
  const schema = {
    commentid: Joi.objectId().required(),
  };

  return Joi.validate(comment, schema);
}

function validatecomment(comment) {
  const schema = {
    body: Joi.string().min(10).max(160).required(),
    userid: Joi.objectId().required(),
    postid: Joi.objectId().required(),
  };

  return Joi.validate(comment, schema);
}

module.exports = router;
