'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('userGoals', {
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
        unique: 'unique_goals',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courseEntities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjectEntities',
          key: 'id'
        },
        unique: 'unique_goals',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      questionSolved: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      goalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
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
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ['userId', 'subjectId']
        }
      }
    })
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('userGoals')
  }
}
