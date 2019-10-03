module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define('leaderboards', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    examId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    courseId: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    subjectId: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    userList: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Leaderboard
}
