'use strict';

module.exports = {
  prepareData
};

async function prepareForInstagram (data) {
  const dataForDB = {
    text: data.caption.text,
    type: data.type,
    url: data.link,
    id_post: data.id,
    network_id: 1
  };
  return dataForDB;
}

async function prepareForTwitter (data) {
  const dataForDB = {
    text: data.full_text,
    type: 'tweet',
    url: data.url,
    id_post: data.id,
    network_id: 2
  };
  return dataForDB;
}

async function prepareData (data) {
  if (data.full_text) {
    return prepareForTwitter(data);
  } else {
    return prepareForInstagram(data);
  }
}
