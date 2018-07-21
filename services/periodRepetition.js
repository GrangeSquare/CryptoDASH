'user strict';

const db = require('../models');

async function getRepetitionByName (name) {
  const periodRepetition = await db.Period.findAll({
    raw: true,
    where: {
      name: name
    },
    include: [{
      module: db.Repetition,
      required: true,
      atributes: ['period', 'repetiton']
    }],
    atributes: ['name']
  });
  console.log(periodRepetition);
  return periodRepetition;
}

module.exports = {
  getRepetitionByName
};
