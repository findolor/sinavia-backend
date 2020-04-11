module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('questions', {
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
    questionLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correctAnswer: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    solvedQuestionImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    solvedQuestionVideo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Question
}
