'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('leaderboards', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      // If courseId and subjectId is null
      // That means the row is for the whole exam
      // If subjectId is null
      // That means it is for the whole course
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'courseEntities',
          key: 'id'
        }
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'subjectEntities',
          key: 'id'
        }
      },
      userList: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false
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
    return queryInterface.dropTable('leaderboards')
  }
}
