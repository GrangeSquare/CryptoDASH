'use strict';

module.exports = {
  mapNameAndCount
};

function mapNameAndCount (status) {
  let countTags = {};

  status.forEach(element => {
    var key = element.dataValues.Hashtag.dataValues.name;
    if (!countTags[key]) {
      countTags[key] = +element.dataValues.count;
    } else {
      countTags[key] += +element.dataValues.count;
    }
  });

  return countTags;
}
