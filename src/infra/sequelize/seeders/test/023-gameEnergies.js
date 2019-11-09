const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('gameEnergies', Faker('gameEnergies'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('gameEnergies', null, {})
  }
}
