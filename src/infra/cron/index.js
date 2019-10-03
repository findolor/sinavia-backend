const CronJob = require('cron').CronJob
const {
  getAllScores,
  makeLeaderboards,
  checkLeaderboard,
  updateLeaderboard
} = require('../../interfaces/databaseInterface/interface')

module.exports = () => {
  return {
    testCronJob: () => {
      const date = new Date()

      date.setSeconds(date.getSeconds() + 5)

      const job = new CronJob(date, () => {
        // console.log('Every second', new Date())
        console.log(`Starts at ${new Date()} made at ${date}`)
      })
      job.start()
    },
    // TODO ADD CRON JOBS HERE LIKE
    // FRIEND GAME CRON
    // Save the friend game crons somewhere and if the game is resolved stop the job
    // LEADERBOARD CRON
    // Calculate the leaderboards at 4 AM maybe???
    // Calculate this for every content we have
    // Right now its every hour
    leaderboardCronJob: () => new CronJob('* * 1 * * *', () => {
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
    },
    null,
    true,
    'Europe/Istanbul')
  }
}
