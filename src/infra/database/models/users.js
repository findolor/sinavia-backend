const { encryptPassword } = require('../../encryption')

module.exports = (sequelize, DataTypes) => {
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
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coverPicture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalPoints: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    premiumEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    signInMethod: {
      type: DataTypes.ENUM('normal', 'google', 'apple'),
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: user => {
        user.password = encryptPassword(user.password)
      }
    },
    freezeTableName: true,
    timestamps: false
  })

  return User
}
