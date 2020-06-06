module.exports = (sequelize, DataTypes) => {
    const ReportedQuestions = sequelize.define('reportedQuestions', {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      reportingUserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reportedQuestionId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      question: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      solution: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      answer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      freezeTableName: true,
      timestamps: false
    })
  
    return ReportedQuestions
  }
  