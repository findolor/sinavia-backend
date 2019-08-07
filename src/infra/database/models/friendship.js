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
    // TODO See if you can make it enum
    friendshipStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'requested'
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate () {
        // TODO Maybe add some associations here?
      }
    }
  })

  return Friendship
}
