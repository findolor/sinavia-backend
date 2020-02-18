const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('questions', Faker('questions'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('questions', null, {})
  }
}
