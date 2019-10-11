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
        allowNull: false
        // TODO MAKE THIS REFERENCED AGAIN
        /* references: {
          model: 'users',
          key: 'id'
        } */
      },
      examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'examEntities',
          key: 'id'
        }
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courseEntities',
          key: 'id'
        }
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjectEntities',
          key: 'id'
        }
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
      /* totalWin: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalLose: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalDraw: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalGames: {
        type: Sequelize.INTEGER,
        allowNull: false
      }, */
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
