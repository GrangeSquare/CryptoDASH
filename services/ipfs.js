'use strict';

const { AUTH_SECRET, IPFS_SERVER_BASE_URL } = process.env;

const axios = require('axios').create({
  timeout: 3000,
  headers: {'auth-header': AUTH_SECRET}
});

async function addToIPFS (data) {
  const hash = await axios.post(`${IPFS_SERVER_BASE_URL}/add_to_ipfs`, data);

  if (!hash) {
    throw new Error();
  }

  return hash.data.data.items[0].hash;
}

async function getFromIPFS (hash) {
  const IPFSNotation = {
    hash: hash
  };

  const resp = await axios.post(`${IPFS_SERVER_BASE_URL}/get_ipfs_file`, IPFSNotation);

  return resp.data;
}

module.exports = {
  addToIPFS,
  getFromIPFS
};
