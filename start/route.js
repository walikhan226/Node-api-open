const express = require('express');
//const genres = require('../routes/genres');
//const customers = require('../routes/customers');
//const movies = require('../routes/movies');
//const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const uploadimage = require('../routes/uploadimage');
const createpost= require('../routes/posts');
const getpost = require ('../routes/getpost');
const likepost = require ('../routes/like');
//const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function(app) {
  //app.use(express.static('uploads/'));
  app.use('/uploads', express.static('uploads/'));

  app.use(express.json());

  //app.use('/api/genres', genres);
 // app.use('/api/customers', customers);
  //app.use('/api/movies', movies);
  //app.use('/api/rentals', rentals);
  app.use('/api/users/register', users);
  app.use('/api/users/login', auth);
  app.use('/api/uploadimage',uploadimage);
  app.use('/api/createpost',createpost);
  app.use('/api/getpost',getpost);
  app.use('/api/like',likepost);
  //app.use('/api/returns', returns);
  app.use(error);
}