'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', {
      signInMethod: {
        type: Sequelize.ENUM('normal', 'google', 'facebook'),
        defaultValue: 'normal',
        allowNull: false
      }
    }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'signInMethod'
    )
  }
}
