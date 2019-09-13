module.exports = (sequelize, DataTypes) => {
  const UserBadge = sequelize.define('userBadges', {
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
    badgeId: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return UserBadge
}
