const axios = require('axios');

async function coinList () {
  let response = await axios.get('https://api.coinmarketcap.com/v2/listings/');
  const data = response.data.data;

  const coinListStructure = {};
  for (let i in data) {
    coinListStructure[data[i].symbol] = data[i].id;
  }
  return coinListStructure;
}

module.exports = {
  coinList
};
