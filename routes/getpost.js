const express = require("express");
const { json } = require("express");
const Geo = require("geo-nearby");
const mongoose = require("mongoose");
const { Posts } = require("../models/posts");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let post = await Posts.find()
      .populate("user ", "username")
   
 
      .sort([["createAt", "descending"]]);
    let count = await Posts.find().count();

    return res.status(200).json({
      count: count,
      data: post,
    });
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});
router.get("/single", async (req, res) => {
  try {
    let post = await Posts.find({_id:req.body._id})
      .populate("user ", "username")
      .populate("likes", "username") 
 
      .sort([["createAt", "descending"]]);
    let count = await Posts.find().count();

    return res.status(200).json({
      count: count,
      data: post,
    });
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});
router.get("/searchnearby", async (req, res) => {
  let pagesize = parseInt(req.query.pagesize);
  let pagenumber = parseInt(req.query.pagenumber);
  console.log(pagesize);
  try {
    let post = await Posts.find()
      .populate("user", "username")
      .skip((pagenumber - 1) * pagesize)
      .limit(pagesize)

      .select("latitude longitude");

    let km = parseInt(req.body.radius);
    const geo = new Geo(post, {
      setOptions: { id: "id", lat: "latitude", lon: "longitude" },
    });

    let result = geo.nearBy(
      parseFloat(req.body.latitude),
      parseFloat(req.body.longitude),
      km * 1000
    );

    let dat = [];

    for (let i = 0; i < result.length; i++) {
      let newpost = await Posts.findOne({ _id: result[i].i }).populate(
        "user",
        "username"
      );

      dat.push(newpost);
    }

    return res.status(200).json({
      pagesize: pagesize,
      pagenumber: pagenumber,
      postcount: dat.length,
      data: dat,
    });
  } catch (e) {
    return res.status(400).json({ status: 0, message: e.message });
  }
});

router.get("/nearby/v1", async (req, res) => {});

module.exports = router;
