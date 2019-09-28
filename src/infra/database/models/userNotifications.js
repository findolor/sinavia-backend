module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define('userNotifications', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notificationType: {
      type: DataTypes.ENUM('friendshipAccepted', 'gameRequest'),
      allowNull: false
    },
    notificationData: {
      type: DataTypes.JSON,
      allowNull: false
    },
    read: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return UserNotification
}
