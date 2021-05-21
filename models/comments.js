const { join } = require("lodash");
const mongoose = require("mongoose");
const Joi = require("joi");
let CommentSchema = new mongoose.Schema({
  likeBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createAt: {
    default: Date.now,
    type: Date,
  },

  replayTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  post:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: {
    type: String,
    minlength: 10,
    maxlength: 260,
  },


});

const Comments = mongoose.model("Comments", CommentSchema);

function validateComments(comment) {
  const schema = {
    likeBy: Joi.objectId(),
    replayTo: Joi.objectId(),
    body: Joi.string().min(2).max(100).required(),
  };

  return joi.validate(comment, schema);
}

exports.Comments= Comments;
exports.validate = validateComments;