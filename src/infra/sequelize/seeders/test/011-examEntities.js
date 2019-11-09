const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('examEntities', Faker('examEntities'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('examEntities', null, {})
  }
}
