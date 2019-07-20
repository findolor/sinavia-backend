'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('questions', {
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
      questionLink: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correctAnswer: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    })
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('questions')
  }
}
