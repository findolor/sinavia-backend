module.exports = (sequelize, DataTypes) => {
  const InviteCode = sequelize.define('inviteCodes', {
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
    code: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return InviteCode
}
