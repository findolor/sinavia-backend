module.exports = (sequelize, DataTypes) => {
    const Statistic = sequelize.define('statistics', {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      examName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subjectName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      correctNumber: {
        type: DataTypes.NUMBER,
        allowNull: false
      },
      incorrectNumber: {
        type: DataTypes.NUMBER,
        allowNull: false
      },
      unansweredNumber: {
        type: DataTypes.NUMBER,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.STRING,
        allowNull: false
      }
      /* earnedPoints: {
        type: DataTypes.NUMBER,
        allowNull: false
      } */
    }, {
      freezeTableName: true,
      timestamps: false,
    })
  
    Statistic.associate = function(models) {
      Statistic.belongsTo(models.UserStatistics, {
        foreignKey: 'id',
        targerKey: 'statisticId'
      })
    }

    return Statistic
  }
  