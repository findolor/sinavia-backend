module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('prices', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    discountPrice: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Price
}
