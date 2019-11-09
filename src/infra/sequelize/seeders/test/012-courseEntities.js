const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('courseEntities', Faker('courseEntities'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('courseEntities', null, {})
  }
}
