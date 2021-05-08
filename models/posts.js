const mongoose = require("mongoose");
const Joi = require("joi");
const User = require('../models/user');


const PostSchema = new mongoose.Schema({
  body: {
    type: String,
    minlength: 10,
    maxlength: 260,
    default: "",
  },
  createAt: {
    default: Date.now,
    type: Date,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  image: {
    type: String,
    default: "",
  },
  postType: {
    required: true,
    type: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  shares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  latitude: {
    type: String,

    required: true,
    default: "",
  },

  longitude: {
    type: String,
    required: true,
    default: "",
  },
});

const Posts = mongoose.model("Posts", PostSchema);

function validatePost(post) {
  const schema = {
    body: Joi.string().min(10).max(160).required(),
    postType: Joi.string().min(2).max(20).required(),
    user: Joi.objectId(),

    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  };

  return Joi.validate(post, schema);
}

exports.Posts = Posts;
exports.validate = validatePost;
