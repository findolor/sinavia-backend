const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('badges', Faker('badges'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('badges', null, {})
  }
}
