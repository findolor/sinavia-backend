module.exports = (sequelize, DataTypes) => {
  const WrongAnsweredQuestion = sequelize.define('wrongAnsweredQuestions', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    questionId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      unique: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    indexes: [{ fields: ['userId', 'questionId'], unique: true }]
  })

  return WrongAnsweredQuestion
}
