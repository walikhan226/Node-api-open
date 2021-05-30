const express = require('express');

const users = require('../routes/users');
const auth = require('../routes/auth');
const uploadimage = require('../routes/uploadimage');
const createpost= require('../routes/posts');
const getpost = require ('../routes/getpost');
const likepost = require ('../routes/like');
const dislikepost = require ('../routes/dislike');
const deletepost = require('../routes/deletepost');
const commentspost = require('../routes/comment');

const testrout = require('../routes/testroute');

const error = require('../middleware/error');

module.exports = function(app) {
  app.use('/uploads', express.static('uploads/'));
  app.use(express.json());
  app.use('/api/users/register', users);
  app.use('/api/users/login', auth);
  app.use('/api/uploadimage',uploadimage);
  app.use('/api/createpost',createpost);
  app.use('/api/getpost',getpost);
  app.use('/api/like',likepost);
  app.use('/api/dislike',dislikepost);
  app.use('/api/comment',commentspost);
  app.use('/api/deletepost',deletepost);
  app.use('/api/testroute',testrout);

  app.use(error);
}