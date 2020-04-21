module.exports = (sequelize, DataTypes) => {
  const ReportedUsers = sequelize.define('reportedUsers', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    reportingUserId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reportedUserId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    username: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    pictures: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return ReportedUsers
}
