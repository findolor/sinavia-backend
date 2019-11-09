const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('jokers', Faker('jokers'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('jokers', null, {})
  }
}
