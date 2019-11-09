const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('userJokers', Faker('userJokers'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userJokers', null, {})
  }
}
