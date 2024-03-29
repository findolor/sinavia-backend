module.exports = (sequelize, DataTypes) => {
  const Statistic = sequelize.define('statistics', {
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
      allowNull: false
    },
    subjectId: {
      type: DataTypes.NUMBER,
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
      type: DataTypes.ENUM('won', 'lost', 'draw'),
      allowNull: true
    },
    earnedPoints: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gameModeType: {
      type: DataTypes.ENUM('ranked', 'friend', 'group', 'solo'),
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Statistic
}
