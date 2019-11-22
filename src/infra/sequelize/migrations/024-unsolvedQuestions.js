'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('unsolvedQuestions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        unique: 'unique_wrongs'
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        },
        unique: 'unique_wrongs'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    }, {
      // This is for making the userId and questionId unique
      // So that a user wont be able to add the same question to db
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ['userId', 'questionId']
        }
      }
    })
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('unsolvedQuestions')
  }
}
