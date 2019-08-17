module.exports = (sequelize, DataTypes) => {
  const Statistic = sequelize.define('statistics', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    examName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correctNumber: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    incorrectNumber: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    unansweredNumber: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    gameResult: {
      type: DataTypes.STRING,
      allowNull: true
    },
    earnedPoints: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Statistic
}
