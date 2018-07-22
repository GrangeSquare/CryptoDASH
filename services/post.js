'use strict';

const db = require('../models');

async function getPostsFromDB () {
  const posts = await db.Post.findAll({ 
    limit: 5,
    order: [['created_at', 'DESC']],
    attributes: ['id_post', 'type', 'network_id']
  });

  if (!posts) {
    throw new Error();
  }

  return posts;
}

module.exports = {
  getPostsFromDB
};
