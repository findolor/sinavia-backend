'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coverPicture: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalPoints: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      birthDate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fcmToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isPremium: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      premiumEndDate: {
        type: Sequelize.DATE,
        allowNull: true
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
    return queryInterface.dropTable('users')
  }
}
