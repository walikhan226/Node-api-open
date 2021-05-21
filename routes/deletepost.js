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

router.post("/", auth, async (req, res) => {
  let { error } = await validatedeletepost(req.body);

  if (error) return res.status(400).json({ message: error });

  try {
    let post = await Posts.deleteMany({ _id: req.body.postids });
    return res.status(200).json({ message: "Success", data :post });

  } catch (e) {

    console.log(e);
    return res.status(400).json({ status: 0, message: e.message });
  }
});

function validatedeletepost(post) {
  const schema = {
    postids: Joi.array().required(),
  };

  return Joi.validate(post, schema);
}

module.exports = router;
