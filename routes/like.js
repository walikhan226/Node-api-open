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
   
    const  {error}  = validateinfo(req.body);

    if (error) {
      return res.status(200).json({
        status: 0,
        message: error.message,
      });
    }



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


router.post("/unlike", async (req, res) => {
  console.log(req.body.userid);
  console.log(req.body.userid);
  try {
   
    const  {error}  = validateinfo(req.body);

    if (error) {
      return res.status(200).json({
        status: 0,
        message: error.message,
      });
    }



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
    if (!post.likes.includes(req.body.userid)) {

      return res
      .status(400)
      .json({ status: 0, message: "Like the post first to unlike" });
    
    }

    await post.update({
      $pull: { likes: req.body.userid },
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




function validateinfo(post) {
  const schema = {
    postid: Joi.objectId().required(),
    userid: Joi.objectId().required(),
  };
  return Joi.validate(post, schema);
}



module.exports = router;
