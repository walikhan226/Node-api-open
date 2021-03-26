const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const { json } = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(
      
      json({
        status: 0,
        message: "Invalid email/password",
      })
      
      
      );
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send(
      res.json({
        status: 0,
        message: "User does not exists",
      })
    );
  }

  try {
    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validpassword) {
      return res.status(400).send(
        json({
          status: 0,
          message: "Invalid email/password",
        })
      );
    }
  } catch (ex) {
    return res.status(400).send(
      json({
        status: 0,
        message: "Invalid email/password",
      })
    );
  }

  const token = user.generateAuthToken();
  res.send(
    json({
      status: 1,
      token: token,
      username:user.username,
      useremail:user.email,
      latitude:user.latitude,
      longitude:user.longitude,
    })
  );
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
