'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('userScores', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'examEntities',
          key: 'id'
        },
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      totalPoints: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalRankedWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalRankedLose: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalRankedDraw: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalFriendWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalFriendLose: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalFriendDraw: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalGroupGames: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalSoloGames: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    })
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('userScores')
  }
}
