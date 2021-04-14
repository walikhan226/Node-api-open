const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Joi = require("joi");
const boolean = require("joi/lib/types/boolean");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60,
    unique: true,
  },

  image: {
    default: '',
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },

  latitude: {
    type: String,
    default: '',

  },

  longitude: {
    type: String,
    default: '',
 
  },
  joining: { type: Date, default: Date.now },

  isAdmin: {
    type:Boolean,
    default:false
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      username: this.username,
      isAdmin: this.isAdmin,
    },
    "abc123"
  );

  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(2).max(50).required(),

    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  };

  //const validation = schema.validate(user);

  return Joi.validate(user, schema);

  return validation;
}

exports.User = User;
exports.validate = validateUser;
