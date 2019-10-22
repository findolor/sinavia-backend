module.exports = (sequelize, DataTypes) => {
  const GameEnergy = sequelize.define('gameEnergies', {
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
    energyAmount: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 5
    },
    energyUsed: {
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
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return GameEnergy
}
