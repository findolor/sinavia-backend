module.exports = (sequelize, DataTypes) => {
  const SubjectNames = sequelize.define('subjectNames', {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageLink: {
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

  return SubjectNames
}
