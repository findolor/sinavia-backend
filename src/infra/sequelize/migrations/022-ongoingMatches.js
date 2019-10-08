'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('ongoingMatches', {
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
        }
      },
      friendId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      userResults: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'statistics',
          key: 'id'
        }
      },
      friendResults: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'statistics',
          key: 'id'
        }
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      questionList: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false
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
    return queryInterface.dropTable('ongoingMatches')
  }
}
