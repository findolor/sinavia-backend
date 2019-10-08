const CronJob = require('cron').CronJob
const moment = require('moment')
moment.locale('tr')
const {
  getAllScores,
  makeLeaderboards,
  checkLeaderboard,
  updateLeaderboard,
  getOngoingMatch,
  createOngoingMatch,
  deleteOngoingMatch,
  getAllOngoingMatches,
  updateStatistic,
  postFriendGameMatchResult,
  getGameContent,
  getUserScore,
  postUserScore,
  putUserScore
} = require('../../interfaces/databaseInterface/interface')

const ongoingMatchesList = []

module.exports = ({ logger, nodeCache }) => {
  // Gets the ongoing match and after sending the notifications deletes it
  // Updates the user statistics and friendsMatch
  const finishUpOngoingMatch = (ongoingMatchId) => {
    getOngoingMatch(ongoingMatchId).then(data => {
      // Converting to normal object
      data.ongoingMatchUser = data.ongoingMatchUser.dataValues
      data.ongoingMatchFriend = data.ongoingMatchFriend.dataValues
      data.ongoingMatchUserStatistics = data.ongoingMatchUserStatistics.dataValues
      if (data.ongoingMatchFriendStatistics !== null) {
        data.ongoingMatchFriendStatistics = data.ongoingMatchFriendStatistics.dataValues

        // Calculating user nets
        let userNet = 0
        let friendNet = 0

        if (data.ongoingMatchUserStatistics.examId !== 1) {
          userNet = data.ongoingMatchUserStatistics.correctNumber - data.ongoingMatchUserStatistics.incorrectNumber / 4
          friendNet = data.ongoingMatchFriendStatistics.correctNumber - data.ongoingMatchFriendStatistics.incorrectNumber / 4
        } else {
          userNet = data.ongoingMatchUserStatistics.correctNumber - data.ongoingMatchUserStatistics.incorrectNumber / 3
          friendNet = data.ongoingMatchFriendStatistics.correctNumber - data.ongoingMatchFriendStatistics.incorrectNumber / 3
        }

        // After calculating the nets we decide on wins/loses/draws
        if (userNet === friendNet) {
          data.ongoingMatchUserStatistics.gameResult = 'draw'
          data.ongoingMatchFriendStatistics.gameResult = 'draw'
          // Save the match result to db
          postFriendGameMatchResult({
            winnerId: data.ongoingMatchUser.id,
            loserId: data.ongoingMatchFriend.id,
            isMatchDraw: true
          })
          // Getting the user scores and updating accordingly
          getUserScore(data.ongoingMatchUser.id, data.examId, data.courseId, data.subjectId).then(userScore => {
            if (userScore === null) {
              postUserScore({
                userId: data.ongoingMatchUser.id,
                examId: data.examId,
                subjectId: data.subjectId,
                courseId: data.courseId,
                totalPoints: 0,
                totalWin: 0,
                totalLose: 0,
                totalDraw: 1,
                totalGames: 1
              })
            } else {
              userScore.totalGames++
              userScore.totalDraw++
              putUserScore(userScore)
            }
          })
          getUserScore(data.ongoingMatchFriend.id, data.examId, data.courseId, data.subjectId).then(userScore => {
            if (userScore === null) {
              postUserScore({
                userId: data.ongoingMatchFriend.id,
                examId: data.examId,
                subjectId: data.subjectId,
                courseId: data.courseId,
                totalPoints: 0,
                totalWin: 0,
                totalLose: 0,
                totalDraw: 1,
                totalGames: 1
              })
            } else {
              userScore.totalGames++
              userScore.totalDraw++
              putUserScore(userScore)
            }
          })
        } else if (userNet > friendNet) {
          data.ongoingMatchUserStatistics.gameResult = 'won'
          data.ongoingMatchFriendStatistics.gameResult = 'lost'
          postFriendGameMatchResult({
            winnerId: data.ongoingMatchUser.id,
            loserId: data.ongoingMatchFriend.id,
            isMatchDraw: false
          })
          getUserScore(data.ongoingMatchUser.id, data.examId, data.courseId, data.subjectId).then(userScore => {
            if (userScore === null) {
              postUserScore({
                userId: data.ongoingMatchUser.id,
                examId: data.examId,
                subjectId: data.subjectId,
                courseId: data.courseId,
                totalPoints: 0,
                totalWin: 1,
                totalLose: 0,
                totalDraw: 0,
                totalGames: 1
              })
            } else {
              userScore.totalGames++
              userScore.totalWin++
              putUserScore(userScore)
            }
          })
          getUserScore(data.ongoingMatchFriend.id, data.examId, data.courseId, data.subjectId).then(userScore => {
            if (userScore === null) {
              postUserScore({
                userId: data.ongoingMatchFriend.id,
                examId: data.examId,
                subjectId: data.subjectId,
                courseId: data.courseId,
                totalPoints: 0,
                totalWin: 0,
                totalLose: 1,
                totalDraw: 0,
                totalGames: 1
              })
            } else {
              userScore.totalGames++
              userScore.totalLose++
              putUserScore(userScore)
            }
          })
        } else {
          data.ongoingMatchUserStatistics.gameResult = 'lost'
          data.ongoingMatchFriendStatistics.gameResult = 'won'
          postFriendGameMatchResult({
            loserId: data.ongoingMatchUser.id,
            winnerId: data.ongoingMatchFriend.id,
            isMatchDraw: false
          })
          getUserScore(data.ongoingMatchUser.id, data.examId, data.courseId, data.subjectId).then(userScore => {
            if (userScore === null) {
              postUserScore({
                userId: data.ongoingMatchUser.id,
                examId: data.examId,
                subjectId: data.subjectId,
                courseId: data.courseId,
                totalPoints: 0,
                totalWin: 0,
                totalLose: 1,
                totalDraw: 0,
                totalGames: 1
              })
            } else {
              userScore.totalGames++
              userScore.totalLose++
              putUserScore(userScore)
            }
          })
          getUserScore(data.ongoingMatchFriend.id, data.examId, data.courseId, data.subjectId).then(userScore => {
            if (userScore === null) {
              postUserScore({
                userId: data.ongoingMatchFriend.id,
                examId: data.examId,
                subjectId: data.subjectId,
                courseId: data.courseId,
                totalPoints: 0,
                totalWin: 1,
                totalLose: 0,
                totalDraw: 0,
                totalGames: 1
              })
            } else {
              userScore.totalGames++
              userScore.totalWin++
              putUserScore(userScore)
            }
          })
        }

        // We update the statistics with win/lose/draw
        updateStatistic(data.ongoingMatchUserStatistics).then(() => {
          updateStatistic(data.ongoingMatchFriendStatistics).then(() => {
          // TODO SEND NOTIS
            // Sending the notifications to both players
            // Blabla notis

            // Deleting the ongoing match row from db
            deleteOngoingMatch(ongoingMatchId).then(data => {
              return data
            })
          })
        })
      } else {
        getUserScore(data.ongoingMatchUser.id, data.examId, data.courseId, data.subjectId).then(userScore => {
          if (userScore === null) {
            postUserScore({
              userId: data.ongoingMatchUser.id,
              examId: data.examId,
              subjectId: data.subjectId,
              courseId: data.courseId,
              totalPoints: 0,
              totalWin: 0,
              totalLose: 0,
              totalDraw: 0,
              totalGames: 1
            })
          } else {
            userScore.totalGames++
            putUserScore(userScore)
          }
        })
        deleteOngoingMatch(ongoingMatchId).then(data => {
          return data
        })
      }
    })
  }

  return {
    // This function will run when server starts (after a crash, after updating...)
    // It will load all the ongoing matches back to our list
    loadOngoingMatchCrons: () => {
      getAllOngoingMatches().then(data => {
        const friendGameCronJob = {
          cronJob: null,
          ongoingMatchId: null
        }

        data.forEach(ongoingMatch => {
          // We set up a cron job for each ongoing match
          const ongoingMatchCron = new CronJob(ongoingMatch.endDate, () => {
            const index = ongoingMatchesList.findIndex(x => x.ongoingMatchId === ongoingMatch.id)
            ongoingMatchesList.splice(index, 1)

            finishUpOngoingMatch(ongoingMatch.id)
          }, null, false, 'Europe/Istanbul')

          // Adding the cron to the list and starting it again
          friendGameCronJob.cronJob = ongoingMatchCron
          friendGameCronJob.ongoingMatchId = ongoingMatch.id
          ongoingMatchesList.push(friendGameCronJob)
          ongoingMatchCron.start()
        })
      })
    },
    // This will create a row in ongoing games.
    // And it will delete the same row when the match ends
    // It will also add it to ongoing games list
    // If the friend plays the match normally, we just stop the cron and remove it from the list and db
    // TODO ADD FUNCS FOR FRIENDMATCHES
    // UPDATE THE GAME RESULTS WHEN THE USERS FINISH
    makeFriendGameCronJob: (userId, friendId, questionList, examId, courseId, subjectId) => {
      return Promise
        .resolve()
        .then(async () => {
          const endDate = moment().add(1, 'days').toDate()

          const friendGameCronJob = {
            cronJob: null,
            ongoingMatchId: null
          }

          // First create an ongoing match entry
          const data = await createOngoingMatch(userId, friendId, endDate, questionList, examId, courseId, subjectId)
          friendGameCronJob.ongoingMatchId = data.id

          // This cron will run after 1 day if the match is not resolved
          const ongoingMatchCron = new CronJob(endDate, () => {
            const index = ongoingMatchesList.findIndex(x => x.ongoingMatchId === data.id)
            ongoingMatchesList.splice(index, 1)

            finishUpOngoingMatch(data.id)
          }, null, false, 'Europe/Istanbul')

          // Adding the cron to the list
          friendGameCronJob.cronJob = ongoingMatchCron
          ongoingMatchesList.push(friendGameCronJob)
          ongoingMatchCron.start()

          // We return the ongoing match id for updating when the user finishes the match
          return data.id
        })
    },
    // This will run when the ongoing match is resolved
    // We will also send notifications to our our users
    // TODO ADD FUNCS FOR FRIENDMATCHES
    // UPDATE THE GAME RESULTS WHEN THE USERS FINISH
    stopOngoingMatchCron: (ongoingMatchId) => {
      return Promise
        .resolve()
        .then(() => {
          // ongoingMatchId = parseInt(ongoingMatchId, 10)
          // Finding the ongoing match object
          const index = ongoingMatchesList.findIndex(x => x.ongoingMatchId === ongoingMatchId)
          let ongoingMatch = ongoingMatchesList.splice(index, 1)

          // Stopping the cron job for that match
          // And deleting it from db
          ongoingMatch = ongoingMatch[0]
          ongoingMatch.cronJob.stop()

          finishUpOngoingMatch(ongoingMatch.ongoingMatchId)
        })
    },
    // TODO Calculate the leaderboards at 4 AM maybe???
    // Calculate this for every content we have
    // Right now its every hour
    leaderboardCronJob: () => new CronJob('* * 4 * * *', () => {
      getAllScores(1)
        .then(data => {
          const userList = []

          data.forEach(userScore => {
            // TODO We will delete this if later
            if (userScore.user !== null) {
              const { dataValues } = userScore.user
              userScore.user = dataValues

              delete userScore.user.password
              delete userScore.user.city
              delete userScore.user.totalPoints
              delete userScore.user.fcmToken
              delete userScore.user.deviceId
              delete userScore.user.email
              delete userScore.user.birthDate
              delete userScore.user.coverPicture
              delete userScore.user.name
              delete userScore.user.lastname
            } else {
              userScore.user = {
                id: userScore.userId,
                username: userScore.userId.substring(0, 8),
                profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTahJbOytdJpTgUSiOKKpoayRwgfYMXnMg2Pk6UOvvoeGey-yQF'
              }
            }

            userList.push(JSON.stringify(userScore))
          })

          if (Object.keys(userList).length !== 0) {
            // We check the leaderboard
            checkLeaderboard(1, null, null).then(data => {
            // If we have an entry we update it
            // If its a new entry we create it
              if (data) {
                updateLeaderboard({
                  id: data.id,
                  examId: data.examId,
                  courseId: data.courseId,
                  subjectId: data.subjectId,
                  userList: userList
                })
              } else {
                makeLeaderboards({
                  examId: 1,
                  userList: userList
                })
              }
            })
          }
        })
    }, null, true, 'Europe/Istanbul', null, true),
    makeGameContentCronJob: () => new CronJob('* * 4 * * *', () => {
      getGameContent().then(data => {
        nodeCache.setValue('gameContent', data).then(response => {
          if (response) logger.info(`Successfully set with the key "gameContent"`)
        })
          .catch(error => {
            logger.error(error.stack)
          })
      })
    }, null, true, 'Europe/Istanbul', null, true)
  }
}
