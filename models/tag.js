var mongoose = require("mongoose");

const Joi = require("joi");
var TagSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
});

const Tag = mongoose.model("Tag", TagSchema);

function validatetag(tag) {
  const schema = {
    body: Joi.string().min(2).max(50),
  };

  return Joi.validate(tag, schema);
}

exports.Tag = Tag;

exports.validate = validatetag;
