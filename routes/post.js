'use strict';

const postService = require('../services/post');
const Response = require('../utils/response');

module.exports = {
  getPosts
};

async function getPosts (req, res, next) {
  try {
    const posts = await postService.getPostsFromDB();
    res.send(Response.success(posts)).end();
  } catch (err) {
    next(err);
  }
}
