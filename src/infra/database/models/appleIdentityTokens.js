module.exports = (sequelize, DataTypes) => {
  const AppleIdentityToken = sequelize.define('appleIdentityTokens', {
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
    identityToken: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return AppleIdentityToken
}
