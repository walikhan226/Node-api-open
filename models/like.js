// var mongoose = require("mongoose");

// var LikeSchema = new mongoose.Schema({
//   likeBy: [
//     {
//       unique: true,
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
//   score: Number,
// });

// const Likes = mongoose.model("Like", LikeSchema);

// function validatelikes(like) {
//   const schema = {
//     likeBy: Joi.objectId(),
//   };

//   //const validation = schema.validate(user);

//   return Joi.validate(like, schema);
// }

// exports.Likes = Likes;
// exports.validate = validatelikes;
