module.exports = (sequelize, DataTypes) => {
  const PurchaseReceipts = sequelize.define('purchaseReceipts', {
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
    receipt: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return PurchaseReceipts
}
