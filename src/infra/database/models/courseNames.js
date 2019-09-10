module.exports = (sequelize, DataTypes) => {
  const CourseName = sequelize.define('courseNames', {
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
    examId: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return CourseName
}
