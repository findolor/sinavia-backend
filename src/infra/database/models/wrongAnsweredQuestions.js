module.exports = (sequelize, DataTypes) => {
  const WrongAnsweredQuestions = sequelize.define('wrongAnsweredQuestions', {
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
    questionId: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return WrongAnsweredQuestions
}
