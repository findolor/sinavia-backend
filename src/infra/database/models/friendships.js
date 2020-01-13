module.exports = (sequelize, DataTypes) => {
  const Friendship = sequelize.define('friendships', {
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
    friendId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    friendshipStatus: {
      type: DataTypes.ENUM('requested', 'approved'),
      allowNull: false,
      defaultValue: 'requested'
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Friendship
}
