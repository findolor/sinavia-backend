module.exports = (sequelize, DataTypes) => {
  const FavouriteQuestion = sequelize.define('favouriteQuestions', {
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
    timestamps: false,
    classMethods: {
      associate () {
        // TODO Maybe add some associations here?
      }
    }
  })

  return FavouriteQuestion
}
