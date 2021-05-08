const express = require("express");
const { json } = require("express");

const mongoose = require("mongoose");

const { Likes } = require("../models/like");
const { Posts } = require("../models/posts");
const Joi = require("joi");
const { User } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body.userid);
  console.log(req.body.userid);
  try {
    // const error1  = validateuserid(req.body.userid);

    // if (error1) {
    //   console.log(error1);
    //   return res.status(200).json({
    //     status: 0,
    //     message: "Invalid Params {user id}",
    //   });
    // }

    // const  error  = validatepostid(req.body.postId);

    // if (error) {
    //   return res.status(200).json({
    //     status: 0,
    //     message: "Invalid Params {post id}",
    //   });
    // }

    let user = await User.findOne({ _id: req.body.userid });
    if (!user) {
      return res.status(200).json({
        status: 0,
        message: "User does not exist ",
      });
    } else {
      console.log(user);
    }

    let post = await Posts.findOne({ _id: req.body.postid });

    if (!post) {
      return res
        .status(400)
        .json({ status: 0, message: "Post does not exist" });
    }
    if (post.likes.includes(req.body.userid)) {

      return res
      .status(400)
      .json({ status: 0, message: "Already liked by user" });
    
    }

    await post.update({
      $push: { likes: req.body.userid },
    });
    post.save();

    return res.status(400).json({
      status: 1,
      message: "sucess",

      post: post,
    });

    //   return res.status(400).json({ status: 1, message: "sucess" });
  } catch (e) {
    //  console.log(e);
    return res.status(400).json({ status: 0, message: e.message });
  }
});

function validatepostid(postid) {
  const schema = {
    postid: Joi.objectId().required(),
  };
  return Joi.validate(postid, schema);
}

function validateuserid(userid) {
  const schema = {
    userid: Joi.objectId().required(),
  };
  return Joi.validate(userid, schema);
}

module.exports = router;
