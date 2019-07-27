'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('statistics', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      examName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      courseName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subjectName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correctNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      incorrectNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unansweredNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('statistic')
  }
}
