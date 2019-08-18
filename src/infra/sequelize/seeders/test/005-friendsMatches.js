const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('friendsMatches', Faker('friendsMatches'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('friendsMatches', null, {})
  }
}
