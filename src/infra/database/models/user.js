const { encryptPassword } = require('../../encryption')

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coverPicture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    birthDate: {
      type: DataTypes.STRING,
      allowNull: false
    }
    /* userLevel: {
      type: DataTypes.JSON,
      allowNull: false
    } */
  }, {
    hooks: {
      beforeCreate: user => {
        user.password = encryptPassword(user.password)
      }
    },
    freezeTableName: true,
    timestamps: false,
  })

  User.associate = function(models) {
    User.belongsTo(models.UserStatistic, {
      foreignKey: 'id',
      targetKey: 'userId'
    })
  }

  return User
}
