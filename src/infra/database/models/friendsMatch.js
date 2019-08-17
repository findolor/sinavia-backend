module.exports = (sequelize, DataTypes) => {
  const FriendsMatch = sequelize.define('friendsMatches', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    winnerId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loserId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMatchDraw: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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

  return FriendsMatch
}
