module.exports = (sequelize, DataTypes) => {
  const UserJoker = sequelize.define('userJokers', {
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
    jokerId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return UserJoker
}
