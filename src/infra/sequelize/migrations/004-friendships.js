'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('friendships', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      friendId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // TODO See if you can make it enum
      friendshipStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'requested'
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
    return queryInterface.dropTable('friendships')
  }
}
