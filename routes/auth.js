const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const { json } = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let user;
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(200).json({
        status:0,
        message:  'Invalid email/password'
      });
    }

    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({
        status: 0,
        message:  'User does not exist'
      });
    }
    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validpassword) {
      return res.status(400).send("Invalid password");
    }
  } catch (ex) {
    return res.status(400).send("not here");
  }

  try {
    const token = user.generateAuthToken();

    console.log(token);
    return res.status(200).json({
      status: 1,
      id: user._id,
      token:  token,
      username:user.username,
      image :user.image

    });
  } catch (e) {
    console.log("here");
    return res.status(400).send("here");
  }
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
