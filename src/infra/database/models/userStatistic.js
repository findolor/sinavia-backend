module.exports = (sequelize, DataTypes) => {
    const UserStatistic = sequelize.define('userStatistics', {
      statisticId: {
        type: DataTypes.NUMBER,
        allowNull: false
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      freezeTableName: true,
      timestamps: false,
    })
  
    UserStatistic.associate = function(models) {
      UserStatistic.hasMany(models.User, {
        foreignKey: 'userId',
        targetKey: 'id'
      })

      UserStatistic.hasMany(models.Statistic, {
          foreignKey: 'statisticId',
          targetKey: 'id'        
      })
    }

    return UserStatistic
  }
  