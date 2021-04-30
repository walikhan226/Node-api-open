const express = require("express");
const { json } = require("express");

const mongoose = require("mongoose");
const { Posts } = require("../models/posts");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let post = await Posts.find().populate("user","username").sort([['createAt', 'descending']]);
    let count = await Posts.find().count();

    return res.status(200).json({
      
      count:count,
      data: post
     
    }
    );
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
}

);








module.exports = router;
