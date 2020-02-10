const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  getMultipleQuestions,
  postStatistic,
  getOneUser,
  postFriendGameMatchResult,
  getUserJoker,
  putUserJoker,
  updateOngoingMatch,
  getUserScoreMultipleIds,
  putUserScore,
  postUserScore,
  getFriendMatches,
  postUnsolvedQuestion,
  updateUserGoals,
  getOneUserGoal
} = require('../../../interfaces/databaseInterface/interface')
const {
  calculateResults,
  calculateResultsSolo
} = require('./helper')
const cronJob = require('../../../infra/cron')
const nodeCache = require('../../../infra/cache')
let fcmService = require('../../../infra/pushNotifications')
fcmService = fcmService({ config })

// A placeholder variable for the empty option
const emptyAnswer = 6

class FriendState {
  constructor (
    playerOneId,
    playerTwoId,
    questionProps,
    questionList,
    questionNumber,
    matchInformation,
    stateInformation,
    playerProps
  ) {
    this.playerOneId = playerOneId
    this.playerTwoId = playerTwoId
    this.questionProps = questionProps
    this.questionList = questionList
    this.questionNumber = questionNumber
    this.matchInformation = matchInformation
    this.stateInformation = stateInformation
    this.playerProps = playerProps
  }
}

class FriendGame {
  constructor () {
    this.friendState = new FriendState(
      '', // p1 id
      '', // p2 id
      [], // question props
      [], // question list
      -1, // current question number
      {}, // match information (exam, course, subject, )
      '', // state information => which action is being proccessed
      {} // general player information like username, answers, ...
    )
  }

  // Adds the player to our room state
  addPlayer (clientId, userInformation, databaseId) {
    this.friendState.playerProps[clientId] = {
      username: userInformation.username,
      answers: [],
      databaseId: databaseId,
      profilePicture: userInformation.profilePicture,
      coverPicture: userInformation.coverPicture
    }
    this.friendState.playerOneId === '' ? this.friendState.playerOneId = clientId : this.friendState.playerTwoId = clientId

    return true
  }

  // Sets the players answers then sends a response to our client
  setPlayerAnswerResults (clientId, button) {
    this.friendState.playerProps[clientId].answers.push({
      answer: button,
      result: this.checkAnswer(button),
      correctAnswer: this.getQuestionAnswer()
    })

    this.changeStateInformation('result')
  }

  // Checks the players answer and returns the proper response
  checkAnswer (playerAnswer) {
    const questionProps = this.friendState.questionProps[this.friendState.questionNumber]

    switch (playerAnswer) {
      // Question unanswered
      case emptyAnswer:
        return null
      // Answer is correct
      case questionProps.correctAnswer:
        return true
      // Answer is incorrect
      default:
        return false
    }
  }

  setQuestions (questionProps, questionList) {
    this.friendState.questionProps = questionProps
    this.friendState.questionList = questionList
  }

  getQuestionProps () {
    return this.friendState.questionProps
  }

  nextQuestion () {
    this.friendState.questionNumber++
  }

  setMatchInformation (matchInformation) {
    this.friendState.matchInformation = matchInformation
  }

  getMatchInformation () {
    return this.friendState.matchInformation
  }

  changeStateInformation (state) {
    this.friendState.stateInformation = state
  }

  getQuestionNumber () {
    return this.friendState.questionNumber
  }

  getQuestionAnswer () {
    return this.friendState.questionProps[this.friendState.questionNumber].correctAnswer
  }

  getPlayerProps () {
    return this.friendState.playerProps
  }

  setPlayerPropsMatchInformation (matchInformation) {
    this.friendState.playerProps.matchInformation = matchInformation
  }

  getPlayerId (playerNumber) {
    switch (playerNumber) {
      case 1:
        return this.friendState.playerOneId
      case 2:
        return this.friendState.playerTwoId
    }
  }

  // Calculates the number of different answers and returns it
  getTotalResults () {
    const playerList = [
      this.friendState.playerProps[this.friendState.playerOneId],
      this.friendState.playerProps[this.friendState.playerTwoId]
    ]

    // We send playerList and get back the results
    const returnData = calculateResults(playerList)

    return returnData
  }

  getTotalResultsSolo () {
    // We send playerList and get back the results
    const returnData = calculateResultsSolo(this.friendState.playerProps[this.friendState.playerOneId])

    return returnData
  }

  // This function is used for the remove options joker
  // Already disabled variable is used to chech if the client has an already disabled button when this joker is pressed
  // We don't pick that option when choosing which options to remove
  removeOptionsJokerPressed (alreadyDisabled) {
    let disabledButton
    // We check if the user has a disabled button. We don't include it if we have one
    alreadyDisabled === undefined ? disabledButton = true : disabledButton = alreadyDisabled

    const examId = this.friendState.matchInformation.examId
    const questionAnswer = this.getQuestionAnswer()

    const optionsToRemove = []

    let randomNumber
    let loop = 0
    let firstRandomOption = -1

    // This code piece is for 4 options
    if (examId === 1) {
      while (loop < 2) {
        randomNumber = Math.floor(Math.random() * 4) + 1
        // Random number shouldn't be equal to the answer and the other choosen number
        if (randomNumber !== questionAnswer && randomNumber !== firstRandomOption) {
          if (disabledButton === true) {
            loop++
            firstRandomOption = randomNumber
            optionsToRemove.push(randomNumber)
          } else {
            // Random number shouldn't be equal to the disabled number
            if (disabledButton !== randomNumber) {
              loop++
              firstRandomOption = randomNumber
              optionsToRemove.push(randomNumber)
            }
          }
        }
      }
    } else {
      // Same logic but for 5 options
      while (loop < 2) {
        randomNumber = Math.floor(Math.random() * 5) + 1
        if (randomNumber !== questionAnswer && randomNumber !== firstRandomOption) {
          if (disabledButton === true) {
            loop++
            firstRandomOption = randomNumber
            optionsToRemove.push(randomNumber)
          } else {
            if (disabledButton !== randomNumber) {
              loop++
              firstRandomOption = randomNumber
              optionsToRemove.push(randomNumber)
            }
          }
        }
      }
    }
    return optionsToRemove
  }

  // This is called when one of the clients leaves the game
  async saveUnfinishedMatchResults (leavingClientId, friendRoomId, userJokers, userScores) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()
    const questionProps = this.getQuestionProps()

    // Result has two items. [0] is playerOne, [1] is playerTwo
    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results.resultList)

    const playerList = []
    const friendMatchInformation = {}

    // We get the results as normal
    const winLoseDraw = this.decideWinLoseDraw(results.resultList, resultsKeys, matchInformation.examId)

    // We check if the leaving client is the first client
    if (leavingClientId === this.friendState.playerOneId) {
      // If the client was winning prior to leaving
      if (winLoseDraw[0].status === 'won') {
        // We mark the client as lost
        winLoseDraw[0].status = 'lost'
        // We mark the other user as won
        winLoseDraw[1].status = 'won'
        // If it is a draw
      } else if (winLoseDraw[0].status === 'draw') {
        winLoseDraw[0].status = 'lost'
        winLoseDraw[1].status = 'won'
      }
    } else {
      if (winLoseDraw[1].status === 'won') {
        winLoseDraw[1].status = 'lost'
        winLoseDraw[0].status = 'won'
      } else if (winLoseDraw[1].status === 'draw') {
        winLoseDraw[1].status = 'lost'
        winLoseDraw[0].status = 'won'
      }
    }

    resultsKeys.forEach(key => {
      let userId = this.getPlayerId(parseInt(key, 10) + 1)

      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results.resultList[key].correct,
        incorrectNumber: results.resultList[key].incorrect,
        unansweredNumber: results.resultList[key].unanswered,
        gameResult: winLoseDraw[key].status,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId,
        gameModeType: 'friend'
      })

      this.decideUserJokers(userJokers, userId)
      this.decideUserScores(userScores, winLoseDraw, matchInformation, key, userId, playerProps[userId].databaseId)
      this.decideUserGoals(playerProps[userId].databaseId, matchInformation.subjectId, results.resultList[key].correct + results.resultList[key].incorrect)

      try {
        // Adding the wrong solved questions to db
        results.unsolvedIndex[key].forEach(wrongQuestionIndex => {
          postUnsolvedQuestion({
            userId: playerProps[userId].databaseId,
            questionId: questionProps[wrongQuestionIndex].id
          }).catch(error => {
            if (error.message !== 'Validation error') {
              logger.error('GAME ENGINE INTERFACE => Cannot post unsolvedQuestion')
              logger.error(error.stack)
            }
          })
        })
      } catch (error) {
        logger.error(error.stack)
      }
    })

    switch (winLoseDraw[0].status) {
      case 'won':
        friendMatchInformation.winnerId = playerProps[this.getPlayerId(1)].databaseId
        friendMatchInformation.loserId = playerProps[this.getPlayerId(2)].databaseId
        friendMatchInformation.isMatchDraw = false
        break
      case 'lost':
        friendMatchInformation.winnerId = playerProps[this.getPlayerId(2)].databaseId
        friendMatchInformation.loserId = playerProps[this.getPlayerId(1)].databaseId
        friendMatchInformation.isMatchDraw = false
        break
      case 'draw':
        friendMatchInformation.winnerId = playerProps[this.getPlayerId(1)].databaseId
        friendMatchInformation.loserId = playerProps[this.getPlayerId(2)].databaseId
        friendMatchInformation.isMatchDraw = true
        break
    }

    logger.info(`Friend game ends with p1: ${winLoseDraw[0].status} and p2: ${winLoseDraw[1].status} roomId: ${friendRoomId}`)

    await postMatchResults(playerList)
    postFriendGameMatchResult(friendMatchInformation).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot post friend match information')
      logger.error(error.stack)
    })
  }

  // This is called when the game ended normally without any clients leaving
  async saveMatchResults (friendRoomId, userJokers, userScores, friendMatches) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()
    const questionProps = this.getQuestionProps()

    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results.resultList)

    const playerList = []
    const friendMatchInformation = {}

    const winLoseDraw = this.decideWinLoseDraw(results.resultList, resultsKeys, matchInformation.examId)

    resultsKeys.forEach(key => {
      let userId = this.getPlayerId(parseInt(key, 10) + 1)

      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results.resultList[key].correct,
        incorrectNumber: results.resultList[key].incorrect,
        unansweredNumber: results.resultList[key].unanswered,
        gameResult: winLoseDraw[key].status,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId,
        gameModeType: 'friend'
      })

      this.decideUserJokers(userJokers, userId)
      this.decideUserScores(userScores, winLoseDraw, matchInformation, key, userId, playerProps[userId].databaseId)
      this.decideUserGoals(playerProps[userId].databaseId, matchInformation.subjectId, results.resultList[key].correct + results.resultList[key].incorrect)

      try {
        // Adding the wrong solved questions to db
        results.unsolvedIndex[key].forEach(wrongQuestionIndex => {
          postUnsolvedQuestion({
            userId: playerProps[userId].databaseId,
            questionId: questionProps[wrongQuestionIndex].id
          }).catch(error => {
            if (error.message !== 'Validation error') {
              logger.error('GAME ENGINE INTERFACE => Cannot post unsolvedQuestion')
              logger.error(error.stack)
            }
          })
        })
      } catch (error) {
        logger.error(error.stack)
      }
    })

    switch (winLoseDraw[0].status) {
      case 'won':
        friendMatchInformation.winnerId = playerProps[this.getPlayerId(1)].databaseId
        friendMatchInformation.loserId = playerProps[this.getPlayerId(2)].databaseId
        friendMatchInformation.isMatchDraw = false
        break
      case 'lost':
        friendMatchInformation.winnerId = playerProps[this.getPlayerId(2)].databaseId
        friendMatchInformation.loserId = playerProps[this.getPlayerId(1)].databaseId
        friendMatchInformation.isMatchDraw = false
        break
      case 'draw':
        friendMatchInformation.winnerId = playerProps[this.getPlayerId(1)].databaseId
        friendMatchInformation.loserId = playerProps[this.getPlayerId(2)].databaseId
        friendMatchInformation.isMatchDraw = true
        break
    }
    friendMatches.push(friendMatchInformation)

    logger.info(`Friend game ends with p1: ${winLoseDraw[0].status} and p2: ${winLoseDraw[1].status} roomId: ${friendRoomId}`)

    await postMatchResults(playerList)
    postFriendGameMatchResult(friendMatchInformation).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot post friend match information')
      logger.error(error.stack)
    })
  }

  saveSoloMatchResults (friendRoomId, userJokers, soloGameDatabaseId) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()
    const questionProps = this.getQuestionProps()

    const results = this.getTotalResultsSolo()

    const resultsKeys = Object.keys(results.resultList)

    const playerList = []

    resultsKeys.forEach(key => {
      let userId = this.getPlayerId(parseInt(key, 10) + 1)

      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results.resultList[key].correct,
        incorrectNumber: results.resultList[key].incorrect,
        unansweredNumber: results.resultList[key].unanswered,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId,
        gameModeType: 'friend'
      })

      this.decideUserJokers(userJokers, userId)

      try {
        // Adding the wrong solved questions to db
        results.unsolvedIndex.forEach(wrongQuestionIndex => {
          postUnsolvedQuestion({
            userId: playerProps[userId].databaseId,
            questionId: questionProps[wrongQuestionIndex].id
          }).catch(error => {
            if (error.message !== 'Validation error') {
              logger.error('GAME ENGINE INTERFACE => Cannot post unsolvedQuestion')
              logger.error(error.stack)
            }
          })
        })
      } catch (error) {
        logger.error(error.stack)
      }
    })

    logger.info(`Friend solo game ends roomId: ${friendRoomId}`)

    // After posting the statistics
    // We update the ongoing game userResult field with the id from statistic
    postMatchResultsSolo(playerList).then(data => {
      const answerList = []

      playerProps[this.getPlayerId(1)].answers.forEach(answer => {
        answerList.push(JSON.stringify(answer))
      })

      updateOngoingMatch({
        id: soloGameDatabaseId,
        userResults: data.id,
        userAnswers: answerList
      }).then(ongoingMatch => {
        cronJob({ logger, nodeCache, fcmService }).stopOngoingMatchCron(ongoingMatch.id, true)
      })
    })
  }

  decideUserJokers (userJokers, userId) {
    if (userJokers[userId] !== null) {
      userJokers[userId].forEach(userJoker => {
        if (userJoker.isUsed) {
          userJoker.joker.amount--
          userJoker.joker.amountUsed++
          userJoker.joker.shouldRenew = true

          putUserJoker(userJoker.joker).catch(error => {
            logger.error('GAME ENGINE INTERFACE => Cannot put userJoker')
            logger.error(error.stack)
          })
        }
      })
    }
  }

  decideUserScores (userScores, winLoseDrawAndPoints, matchInformation, key, userId, databaseId) {
    if (userScores[userId].shouldUpdate) {
      switch (winLoseDrawAndPoints[key].status) {
        case 'won':
          userScores[userId].userScore.totalFriendWin++
          break
        case 'lost':
          userScores[userId].userScore.totalFriendLose++
          break
        case 'draw':
          userScores[userId].userScore.totalFriendDraw++
          break
      }
      putUserScore(userScores[userId].userScore).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot put userScore')
        logger.error(error.stack)
      })
    } else {
      let win = 0
      let lose = 0
      let draw = 0
      switch (winLoseDrawAndPoints[key].status) {
        case 'won':
          win = 1
          break
        case 'lost':
          lose = 1
          break
        case 'draw':
          draw = 1
          break
      }
      postUserScore({
        userId: databaseId,
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        totalPoints: 0,
        totalFriendWin: win,
        totalFriendLose: lose,
        totalFriendDraw: draw
      }).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot post userScore')
        logger.error(error.stack)
      })
    }
  }

  decideUserGoals (databaseId, subjectId, solvedQuestionAmount) {
    if (solvedQuestionAmount === 0) return
    getOneUserGoal(databaseId, subjectId).then(data => {
      if (data) {
        data.questionSolved += solvedQuestionAmount

        updateUserGoals(data).catch(error => logger.error(error.stack))
      }
    })
  }

  // This is used for deciding if the users had draw, one of them wins and the other loses
  decideWinLoseDraw (results, resultsKeys, examId) {
    const winLoseDraw = []
    let net
    const netList = []

    resultsKeys.forEach(key => {
      if (examId !== 1) {
        net = results[key].correct - results[key].incorrect / 4
      } else {
        net = results[key].correct - results[key].incorrect / 3
      }
      // We calculate net for deciding who wins
      netList.push(net)
    })

    // We push the results two times for two clients
    if (netList[0] === netList[1]) {
      winLoseDraw.push({
        status: 'draw'
      })
      winLoseDraw.push({
        status: 'draw'
      })
    } else if (netList[0] > netList[1]) {
      winLoseDraw.push({
        status: 'won'
      })
      winLoseDraw.push({
        status: 'lost'
      })
    } else {
      winLoseDraw.push({
        status: 'lost'
      })
      winLoseDraw.push({
        status: 'won'
      })
    }

    return winLoseDraw
  }

  resetRoom () {
    const playerIds = Object.keys(this.friendState.playerProps)

    playerIds.forEach(element => {
      this.friendState.playerProps[element].answers = []
    })

    this.friendState.questionNumber = -1
    this.friendState.questionProps = []
    this.friendState.questionList = []
    this.friendState.stateInformation = ''
  }
}

// Saves the results to the database
function postMatchResults (playerList) {
  try {
    // We save the statistic to our database
    playerList.forEach(player => {
      postStatistic(player)
    })
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot post statistics')
    logger.error(error.stack)
  }
}

function postMatchResultsSolo (playerList) {
  try {
    return Promise
      .resolve()
      .then(() => {
        return postStatistic(playerList[0])
      })
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot post statistics')
    logger.error(error.stack)
  }
}

function convertUnderscoreToSpace (text) {
  return text.replace('_', ' ')
}

class FriendRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 2
    this.readyPlayerCount = 0
    this.finishedPlayerCount = 0
    this.questionAmount = 3
    this.isMatchFinished = false
    this.leavingClientId = null
    this.joinedPlayerNum = 0
    this.addedUserNumber = 0
    this.userJokers = {}
    this.userScores = {}
    this.isSoloGame = false
    this.soloGameDBId = 0
    this.friendMatches = null
  }

  onAuth (client, options, request) {
    if (options.rejectGame) {
      this.broadcast({
        action: 'game-reject'
      })
      this.disconnect()
    } else return true
  }

  async onCreate (options) {
    // We initialize our game here
    this.setState(new FriendGame())

    const matchInformation = {
      examId: options.examId,
      courseId: options.courseId,
      subjectId: options.subjectId,
      roomCode: options.roomCode,
      userId: options.userId,
      friendId: options.friendId,
      userUsername: options.userUsername,
      userProfilePicture: options.userProfilePicture,
      examName: convertUnderscoreToSpace(options.examName),
      courseName: convertUnderscoreToSpace(options.courseName),
      subjectName: convertUnderscoreToSpace(options.subjectName)
    }
    this.state.setMatchInformation(matchInformation)
    this.state.setPlayerPropsMatchInformation(matchInformation)

    // Fetching questions from database
    getMultipleQuestions(
      options.examId,
      options.courseId,
      options.subjectId,
      this.questionAmount
    ).then(questionProps => {
      const questionList = []

      // Getting only the question links
      questionProps.forEach(element => {
        questionList.push(element.questionLink)
      })
      // Setting general match related info
      this.state.setQuestions(questionProps, questionList)
    }).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot get questions')
      logger.error(error.stack)
    })

    try {
    // We fetch the user scores when the room is created
    // Then map it with the client id in onJoin function
      const userScores = await getUserScoreMultipleIds(
        [options.userId, options.friendId],
        options.examId,
        options.courseId,
        options.subjectId
      )
      this.userScores.scoreList = userScores
    } catch (error) {
      logger.error('GAME ENGINE INTERFACE => Cannot get userScores')
      logger.error(error.stack)
    }

    try {
      const friendMatches = await getFriendMatches(options.userId, options.friendId)
      this.friendMatches = friendMatches
    } catch (error) {
      logger.error('GAME ENGINE INTERFACE => Cannot get friend match information')
      logger.error(error.stack)
    }
  }

  onJoin (client, options) {
    // If we have reached the maxClients, we lock the room for unexpected things
    if (this._maxClientsReached) { this.lock() }

    // Sending the scores to the users
    this.send(client, {
      action: 'save-user-points',
      userScores: this.userScores.scoreList
    })
    // Sending the friend matches to the users
    this.send(client, {
      action: 'friend-matches',
      friendMatches: this.friendMatches
    })

    // We get user jokers from database
    // Later on we send all the joker names and ids to the client
    // If the client doesnt have a joker it will be blacked out
    getUserJoker(options.databaseId).then(userJokers => {
      this.userJokers[client.sessionId] = []
      userJokers.forEach(userJoker => {
        this.userJokers[client.sessionId].push({
          isUsed: false,
          joker: userJoker,
          id: userJoker.jokerId
        })
      })
    }).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot get userJoker')
      logger.error(error.stack)
    })

    const index = this.userScores.scoreList.findIndex(x => x.userId === options.databaseId)
    if (index !== -1) {
      this.userScores[client.sessionId] = {
        shouldUpdate: true,
        userScore: this.userScores.scoreList[index]
      }
    } else {
      this.userScores[client.sessionId] = {
        shouldUpdate: false,
        userScore: null
      }
    }

    // Getting user information from database
    getOneUser(options.databaseId).then(userInformation => {
      const { dataValues } = userInformation
      userInformation = dataValues

      // Finally adding the player to our room state
      if (this.state.addPlayer(client.sessionId, userInformation, options.databaseId)) this.addedUserNumber++

      if (this.addedUserNumber === 2) {
        // We send the clients player information
        this.clock.setTimeout(() => {
          // Sending the scores to the users
          this.send(client, {
            action: 'save-user-points',
            userScores: this.userScores.scoreList
          })
          // Sending the friend matches to the users
          this.send(client, {
            action: 'friend-matches',
            friendMatches: this.friendMatches
          })

          this.broadcast(this.state.getPlayerProps())
        }, 500)
        logger.info(`Friend game starts with p1: ${this.state.getPlayerProps()[this.state.getPlayerId(1)].databaseId} and p2: ${this.state.getPlayerProps()[this.state.getPlayerId(2)].databaseId} roomId: ${this.roomId}`)
      }
    }).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot get user')
      logger.error(error.stack)
    })
  }

  // TODO Move the actions into their own functions
  async onMessage (client, data) {
    const that = this
    switch (data.action) {
      // Players send 'ready' action to server for letting it know that they are ready for the game
      case 'ready':
        if (++this.readyPlayerCount === 2) {
          // When players get the 'question' action they start the round and play.
          // This delay will be longer due to pre-match player showcases.
          /* setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 3000) */
          that.state.nextQuestion()
          that.state.changeStateInformation('question')
        }
        break
      case 'ready-solo':
        that.state.nextQuestion()
        that.state.changeStateInformation('question')
        break
      // 'finished' action is sent after a player answers a question.
      case 'finished':
        if (++this.finishedPlayerCount === 2) {
          // We check if this is the last question
          // We extract one because questionNumber started from -1
          if (this.state.getQuestionNumber() === this.questionAmount - 1) {
            // Sending the questions in full for favouriting
            this.broadcast({
              action: 'save-questions',
              fullQuestionList: this.state.getQuestionProps()
            })
            this.state.changeStateInformation('show-results')
            // Like always there is a delay to show the answers
            setTimeout(() => {
              this.state.changeStateInformation('match-finished')
              this.isMatchFinished = true
              // We save the results after the match is finished
              this.state.saveMatchResults(this.roomId, this.userJokers, this.userScores, this.friendMatches)
            }, 5000)
            break
          }
          // If both players are finished, we reset the round for them and start another round.
          this.finishedPlayerCount = 0
          this.state.changeStateInformation('show-results')
          // Delay for showing the results
          setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 5000)
        }
        break
      case 'finished-solo':
        if (this.state.getQuestionNumber() === this.questionAmount - 1) {
          this.state.changeStateInformation('show-results')
          // Sending the questions in full for favouriting
          this.clock.setTimeout(() => {
            this.broadcast({
              action: 'save-questions',
              fullQuestionList: this.state.getQuestionProps()
            })
          }, 1000)
          // Sending the friend info to the user
          getOneUser(this.state.getMatchInformation().friendId).then(friendInfo => {
            this.send(client, {
              action: 'save-friend-infos',
              friendUsername: friendInfo.username,
              friendProfilePicture: friendInfo.profilePicture
            })

            // Like always there is a delay to show the answers
            setTimeout(() => {
              this.state.changeStateInformation('match-finished-user')
              this.isMatchFinished = true
              // We save the results after the match is finished
              this.state.saveSoloMatchResults(this.roomId, this.userJokers, this.soloGameDBId)
            }, 5000)
          }).catch(error => {
            logger.error('GAME ENGINE INTERFACE => Cannot get user')
            logger.error(error.stack)
          })
          break
        }
        this.state.changeStateInformation('show-results')
        // Delay for showing the results
        setTimeout(() => {
          that.state.nextQuestion()
          that.state.changeStateInformation('question')
        }, 5000)
        break
      // 'button-press' action is sent when a player presses a button
      case 'button-press':
        this.state.setPlayerAnswerResults(client.sessionId, data.button)
        break
      case 'remove-options-joker':
        // We mark the joker as used
        if (this.userJokers[client.sessionId] !== null) {
          let index = this.userJokers[client.sessionId].findIndex(x => x.id === data.jokerId)
          if (this.userJokers[client.sessionId][index].joker.amount === 0) {
            this.send(client, {
              action: 'error-joker'
            })
            break
          }
          this.userJokers[client.sessionId][index].isUsed = true
        }

        let optionsToRemove

        // If we have a disabled button before hand, we send it. Otherwise we don't
        if (data.disabled === false) { optionsToRemove = this.state.removeOptionsJokerPressed() } else { optionsToRemove = this.state.removeOptionsJokerPressed(data.disabled) }

        this.send(client, {
          action: 'remove-options-joker',
          optionsToRemove: optionsToRemove
        })
        break
      case 'second-chance-joker':
        // We mark the joker as used
        if (this.userJokers[client.sessionId] !== null) {
          let index = this.userJokers[client.sessionId].findIndex(x => x.id === data.jokerId)
          if (this.userJokers[client.sessionId][index].joker.amount === 0) {
            this.send(client, {
              action: 'error-joker'
            })
            break
          }
          this.userJokers[client.sessionId][index].isUsed = true
        }

        const questionAnswer = this.state.getQuestionAnswer()

        // We send the question answer to client for checking if it choose the correct option
        this.send(client, {
          action: 'second-chance-joker',
          questionAnswer: questionAnswer
        })
        break
      case 'see-opponent-answer-joker':
        // We mark the joker as used
        if (this.userJokers[client.sessionId] !== null) {
          let index = this.userJokers[client.sessionId].findIndex(x => x.id === data.jokerId)
          if (this.userJokers[client.sessionId][index].joker.amount === 0) {
            this.send(client, {
              action: 'error-joker'
            })
            break
          }
          this.userJokers[client.sessionId][index].isUsed = true

          this.send(client, {
            action: 'see-opponent-answer-joker'
          })
        }
        break
      case 'replay':
        this.broadcast({
          action: 'friend-matches',
          friendMatches: this.friendMatches
        })
        this.clients.forEach(element => {
          if (element.id !== client.sessionId) {
            this.send(element, {
              action: 'replay'
            })
          }
        })
        break
      case 'reset-room':
        this.state.resetRoom()
        // Becase we are playing again, we need to update userScores this match
        // And we reset the used jokers
        Object.keys(this.userScores).forEach(userId => {
          this.userScores[userId].shouldUpdate = true
        })
        Object.keys(this.userJokers).forEach(userId => {
          this.userJokers[userId].isUsed = false
        })

        this.questionAmount = 3
        this.readyPlayerCount = 0
        this.finishedPlayerCount = 0
        this.isMatchFinished = false

        try {
          // Fetching questions from database
          const questionProps = await getMultipleQuestions(
            this.state.getMatchInformation().examId,
            this.state.getMatchInformation().courseId,
            this.state.getMatchInformation().subjectId,
            this.questionAmount
          )

          const questionList = []

          // Getting only the question links
          questionProps.forEach(element => {
            questionList.push(element.questionLink)
          })
          // Setting general match related info
          this.state.setQuestions(questionProps, questionList)
        } catch (error) {
          logger.error('GAME ENGINE INTERFACE => Cannot get questions')
          logger.error(error.stack)
        }
        break
        // TODO Make the cron here
      case 'start-ahead':
        this.isSoloGame = true
        delete this.userScores.scoreList
        this.lock()
        logger.info(`Friend solo game starts with player: ${this.state.getPlayerProps()[this.state.getPlayerId(1)].databaseId} roomId: ${this.roomId}`)

        const matchInformation = this.state.getMatchInformation()

        // We stringfy every question to store it as json
        const questions = this.state.getQuestionProps()
        const questionsJSON = []

        questions.forEach(question => {
          questionsJSON.push(JSON.stringify(question))
        })

        // We start a cron job for this solo friend game
        // We send a notification to the other user
        // When the match resolves we will delete this cron later
        cronJob({ logger, nodeCache, fcmService }).makeFriendGameCronJob(
          matchInformation.userId,
          matchInformation.friendId,
          questionsJSON,
          matchInformation.examId,
          matchInformation.courseId,
          matchInformation.subjectId,
          matchInformation.userUsername,
          matchInformation.userProfilePicture,
          {
            examName: matchInformation.examName,
            courseName: matchInformation.courseName,
            subjectName: matchInformation.subjectName
          },
          matchInformation.roomCode
        ).then(data => {
          // We save the id for ongoing game to update it later
          this.soloGameDBId = data
        })
        break
      case 'leave-match':
        this.isMatchFinished = true
        this.send(client, {
          action: 'leave-match',
          clientId: client.sessionId,
          playerProps: this.state.getPlayerProps(),
          fullQuestionList: this.state.getQuestionProps()
        })
        if (this.isSoloGame) this.state.saveSoloMatchResults(this.roomId, this.userJokers, this.soloGameDBId)
        else this.state.saveUnfinishedMatchResults(client.sessionId, this.roomId, this.userJokers, this.userScores)
        break
    }
  }

  onLeave (client, consented) {
    logger.info({
      message: 'Client leaving',
      clientId: client.sessionId,
      consented: consented
    })

    // TODO add errors on all of these events
    // If the room is not empty
    if (this.clients.length !== 0) {
      const lastClient = this.clients[0]

      this.send(lastClient, {
        action: 'client-leaving',
        clientId: lastClient.sessionId,
        playerProps: this.state.getPlayerProps(),
        fullQuestionList: this.state.getQuestionProps()
      })

      // We save the leaving clients id to mark it as lost for later
      this.leavingClientId = client.sessionId

      // If the match was still going on
      if (!this.isMatchFinished) {
        // We send the leaving clients id
        // We do different stuff if the client has left before the match ends
        this.state.saveUnfinishedMatchResults(this.leavingClientId, this.roomId, this.userJokers, this.userScores)
      }
    }
    if (this.isSoloGame && !this.isMatchFinished) this.state.saveSoloMatchResults(this.roomId, this.userJokers, this.soloGameDBId)
  }

  onDispose () {
    logger.info('Room disposed')
  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(FriendState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(FriendRoom)

exports.friendRoom = FriendRoom
