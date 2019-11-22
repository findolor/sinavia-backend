module.exports = (sequelize, DataTypes) => {
  const UnsolvedQuestion = sequelize.define('unsolvedQuestions', {
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

  return UnsolvedQuestion
}
