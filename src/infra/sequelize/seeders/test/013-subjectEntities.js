const Faker = require('../../../support/fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('subjectEntities', Faker('subjectEntities'), {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('subjectEntities', null, {})
  }
}
