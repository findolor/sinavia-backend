const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('favouriteQuestions', Faker('favouriteQuestions'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('favouriteQuestions', null, {})
  }
}
