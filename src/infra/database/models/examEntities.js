module.exports = (sequelize, DataTypes) => {
  const ExamEntity = sequelize.define('examEntities', {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    examDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return ExamEntity
}
