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
      allowNull: false,
      defaultValue: 10
    },
    amountUsed: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    shouldRenew: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    dateRenewed: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return UserJoker
}
