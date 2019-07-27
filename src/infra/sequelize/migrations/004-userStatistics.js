'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('userStatistics', {
      userId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statisticId: {
          type: Sequelize.INTEGER,
          allowNull: false
      }
    })
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('userStatistics')
  }
}
