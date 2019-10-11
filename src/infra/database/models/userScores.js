module.exports = (sequelize, DataTypes) => {
  const UserScore = sequelize.define('userScores', {
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
    totalPoints: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    totalRankedWin: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    totalRankedLose: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    totalRankedDraw: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    totalFriendWin: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    totalFriendLose: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    totalFriendDraw: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    totalGroupGames: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    }
    /* totalWin: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    totalLose: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    totalDraw: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    totalGames: {
      type: DataTypes.NUMBER,
      allowNull: false
    } */
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return UserScore
}
