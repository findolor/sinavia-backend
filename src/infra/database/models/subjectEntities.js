module.exports = (sequelize, DataTypes) => {
  const SubjectEntity = sequelize.define('subjectEntities', {
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
    courseId: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return SubjectEntity
}
