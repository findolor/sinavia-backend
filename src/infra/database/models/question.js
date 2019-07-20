module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('questions', {
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
    questionLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correctAnswer: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate () {
        // TODO Maybe add some associations here?
      }
    }
  })

  return Question
}
