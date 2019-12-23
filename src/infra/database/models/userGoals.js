module.exports = (sequelize, DataTypes) => {
  const UserGoal = sequelize.define('userGoals', {
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
    subjectId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    questionSolved: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    goalAmount: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return UserGoal
}
