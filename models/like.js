var mongoose = require("mongoose");

var LikeSchema = new mongoose.Schema({
  likeBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  score: Number,
});

const Likes = mongoose.model("Likes", userSchema);

function validatelikes(like) {
  const schema = {
    likeBy: Joi.objectId(),
  };

  //const validation = schema.validate(user);

  return Joi.validate(like, schema);
}

exports.Likes = Likes;
exports.validate = validatelikes;
