module.exports = (sequelize, DataTypes) => {
  const OngoingMatch = sequelize.define('ongoingMatches', {
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
    friendId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userResults: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    friendResults: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    questionList: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
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
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return OngoingMatch
}
