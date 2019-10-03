const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('userScores', Faker('userScores'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userScores', null, {})
  }
}
