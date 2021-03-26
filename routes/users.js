const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User(
      _.pick(req.body, [
        "name",
        "email",
        "password",
        "username",
        "latitude",
        "longitude",
        "image"
      ])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(
        _.pick(user, [
          "_id",
          "name",
          "email",
          "username",
          "latitude",
          "longitude",
          "image"
        ])
      );
  } catch (e) {
    return res.status(400).send(e);
  }
});

module.exports = router;
