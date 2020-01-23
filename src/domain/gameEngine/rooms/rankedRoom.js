const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  getMultipleQuestions,
  postStatistic,
  getOneUser,
  getUserScore,
  postUserScore,
  putUserScore,
  getUserJoker,
  putUserJoker,
  updateUserTotalPoints,
  postUnsolvedQuestion,
  updateUserGoals,
  getOneUserGoal
} = require('../../../interfaces/databaseInterface/interface')
const {
  calculateResults
} = require('./helper')

// A placeholder variable for the empty option
const emptyAnswer = 6
const FINISH_MATCH_POINT = 20
const WIN_MATCH_POINT = 100
const CORRECT_ANSWER_MULTIPLIER = 20
const DRAW_MATCH_POINT = 50
const BOT_CLIENT_ID = 'bot_client_id'
const BOT_USERNAME = 'BOT'
const BOT_COVER_PICTURE = 'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/coverPictures%2FdefaultCoverPicture.jpg?alt=media&token=146b2665-502d-4d0e-b83f-94557731da56'
const BOT_PROFILE_PICTURE = 'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/profilePictures%2FdefaultProfilePicture.png?alt=media&token=48e536e2-a937-4734-871f-d7d982c663cf'
const BOT_CITY = 'İzmir'
const BOT_ID = 'bot_id'

class RankedState {
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

class RankedGame {
  constructor () {
    this.rankedState = new RankedState(
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
  addPlayer (clientId, userInformation, userScores, isBot) {
    this.rankedState.playerProps[clientId] = {
      username: userInformation.username,
      answers: [],
      databaseId: userInformation.id,
      profilePicture: userInformation.profilePicture,
      coverPicture: userInformation.coverPicture,
      city: userInformation.city
    }

    if (!isBot) this.rankedState.playerProps[clientId].totalPoints = userScores[clientId].userScore !== null ? userScores[clientId].userScore.totalPoints : 0
    else {
      // We randomize a point based on the clients points
      const pointDifference = Math.floor(Math.random() * this.rankedState.playerProps[this.rankedState.playerOneId].totalPoints + 1)
      let addOrSubtract
      // We get true/false for adding or subtracting
      // This is with a probability of 25%
      (function () {
        addOrSubtract = Math.random() <= 0.25
      })()
      // Then we either add it or subtract it
      if (addOrSubtract) this.rankedState.playerProps[clientId].totalPoints = this.rankedState.playerProps[this.rankedState.playerOneId].totalPoints + 2500
      else this.rankedState.playerProps[clientId].totalPoints = this.rankedState.playerProps[this.rankedState.playerOneId].totalPoints - pointDifference
    }

    this.rankedState.playerOneId === '' ? this.rankedState.playerOneId = clientId : this.rankedState.playerTwoId = clientId

    return true
  }

  // Checks players database ids to prevent users from playing a game with themselves
  isBothPlayersSame (databaseId) {
    if (this.rankedState.playerProps[this.rankedState.playerOneId].databaseId === databaseId) return true
    else return false
  }

  // Sets the players answers then sends a response to our client
  setPlayerAnswerResults (clientId, button) {
    this.rankedState.playerProps[clientId].answers.push({
      answer: button,
      result: this.checkAnswer(button),
      correctAnswer: this.getQuestionAnswer()
    })

    this.changeStateInformation('result')
  }

  // Checks the players answer and returns the proper response
  checkAnswer (playerAnswer) {
    const questionProps = this.rankedState.questionProps[this.rankedState.questionNumber]

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
    this.rankedState.questionProps = questionProps
    this.rankedState.questionList = questionList
  }

  nextQuestion () {
    this.rankedState.questionNumber++
  }

  setMatchInformation (matchInformation) {
    this.rankedState.matchInformation = matchInformation
  }

  getMatchInformation () {
    return this.rankedState.matchInformation
  }

  changeStateInformation (state) {
    this.rankedState.stateInformation = state
  }

  getQuestionProps () {
    return this.rankedState.questionProps
  }

  getQuestionNumber () {
    return this.rankedState.questionNumber
  }

  getQuestionAnswer () {
    return this.rankedState.questionProps[this.rankedState.questionNumber].correctAnswer
  }

  getPlayerProps () {
    return this.rankedState.playerProps
  }

  setPlayerPropsMatchInformation (matchInformation) {
    this.rankedState.playerProps.matchInformation = matchInformation
  }

  getPlayerId (playerNumber) {
    switch (playerNumber) {
      case 1:
        return this.rankedState.playerOneId
      case 2:
        return this.rankedState.playerTwoId
    }
  }

  // Calculates the number of different answers and returns it
  getTotalResults () {
    const playerList = [
      this.rankedState.playerProps[this.rankedState.playerOneId],
      this.rankedState.playerProps[this.rankedState.playerTwoId]
    ]

    // We send playerList and get back the results
    const returnData = calculateResults(playerList)

    return returnData
  }

  // This function is used for the remove options joker
  // Already disabled variable is used to chech if the client has an already disabled button when this joker is pressed
  // We don't pick that option when choosing which options to remove
  removeOptionsJokerPressed (alreadyDisabled) {
    let disabledButton
    // We check if the user has a disabled button. We don't include it if we have one
    alreadyDisabled === undefined ? disabledButton = true : disabledButton = alreadyDisabled

    const examId = this.rankedState.matchInformation.examId
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
  saveUnfinishedMatchResults (leavingClientId, rankedRoomId, userScores, userJokers, userInformations) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()
    const questionProps = this.getQuestionProps()

    // Result has two items. [0] is playerOne, [1] is playerTwo
    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results.resultList)

    const playerList = []

    // We get the results and points as normal
    const winLoseDrawAndPoints = this.decideWinLoseDrawAndPoints(results.resultList, resultsKeys, matchInformation.examId)

    // We subtract finished match point
    winLoseDrawAndPoints[0].points -= FINISH_MATCH_POINT
    winLoseDrawAndPoints[1].points -= FINISH_MATCH_POINT

    // We check if the leaving client is the first client
    if (leavingClientId === this.rankedState.playerOneId) {
      // If the client was winning prior to leaving
      if (winLoseDrawAndPoints[0].status === 'won') {
        // We subtract winning point
        winLoseDrawAndPoints[0].points -= WIN_MATCH_POINT
        // We mark the client as lost
        winLoseDrawAndPoints[0].status = 'lost'
        // We mark the other user as won
        winLoseDrawAndPoints[1].status = 'won'
        // We give the other client winning match point
        winLoseDrawAndPoints[1].points += WIN_MATCH_POINT
        // If it is a draw
      } else if (winLoseDrawAndPoints[0].status === 'draw') {
        // We subtract draw point
        winLoseDrawAndPoints[0].points -= DRAW_MATCH_POINT
        winLoseDrawAndPoints[0].status = 'lost'
        winLoseDrawAndPoints[1].status = 'won'
        winLoseDrawAndPoints[1].points += WIN_MATCH_POINT
        winLoseDrawAndPoints[1].points -= DRAW_MATCH_POINT
      }
    } else {
      if (winLoseDrawAndPoints[1].status === 'won') {
        winLoseDrawAndPoints[1].points -= WIN_MATCH_POINT
        winLoseDrawAndPoints[1].status = 'lost'
        winLoseDrawAndPoints[0].status = 'won'
        winLoseDrawAndPoints[0].points += WIN_MATCH_POINT
      } else if (winLoseDrawAndPoints[1].status === 'draw') {
        winLoseDrawAndPoints[1].points -= DRAW_MATCH_POINT
        winLoseDrawAndPoints[1].status = 'lost'
        winLoseDrawAndPoints[0].status = 'won'
        winLoseDrawAndPoints[0].points += WIN_MATCH_POINT
        winLoseDrawAndPoints[0].points -= DRAW_MATCH_POINT
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
        gameResult: winLoseDrawAndPoints[key].status,
        earnedPoints: winLoseDrawAndPoints[key].points,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId,
        gameModeType: 'ranked'
      })

      if (userScores[userId] !== undefined) {
        this.decideUserScores(userScores, winLoseDrawAndPoints, matchInformation, key, userId, playerProps[userId].databaseId)
        this.decideUserJokers(userJokers, userId)
        this.decideUserInformationTotalPoints(userInformations[userId], winLoseDrawAndPoints[key].points)
        this.decideUserGoals(playerProps[userId].databaseId, matchInformation.subjectId, results.resultList[key].correct + results.resultList[key].incorrect)
      } else playerList.pop()

      // Adding the wrong solved questions to db
      results.unsolvedIndex[key].forEach(wrongQuestionIndex => {
        if (playerProps[userId].databaseId === 'bot_id') return
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
    })

    logger.info(`Ranked game ends with p1: ${winLoseDrawAndPoints[0].status} and p2: ${winLoseDrawAndPoints[1].status} roomId: ${rankedRoomId}`)

    postMatchResults(playerList)
  }

  // This is called when the game ended normally without any clients leaving
  saveMatchResults (rankedRoomId, userScores, userJokers, userInformations) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()
    const questionProps = this.getQuestionProps()

    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results.resultList)

    const playerList = []

    const winLoseDrawAndPoints = this.decideWinLoseDrawAndPoints(results.resultList, resultsKeys, matchInformation.examId)

    resultsKeys.forEach(key => {
      let userId = this.getPlayerId(parseInt(key, 10) + 1)

      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results.resultList[key].correct,
        incorrectNumber: results.resultList[key].incorrect,
        unansweredNumber: results.resultList[key].unanswered,
        gameResult: winLoseDrawAndPoints[key].status,
        earnedPoints: winLoseDrawAndPoints[key].points,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId,
        gameModeType: 'ranked'
      })

      if (userScores[userId] !== undefined) {
        this.decideUserScores(userScores, winLoseDrawAndPoints, matchInformation, key, userId, playerProps[userId].databaseId)
        this.decideUserJokers(userJokers, userId)
        this.decideUserInformationTotalPoints(userInformations[userId], winLoseDrawAndPoints[key].points)
        this.decideUserGoals(playerProps[userId].databaseId, matchInformation.subjectId, results.resultList[key].correct + results.resultList[key].incorrect)
      } else playerList.pop()

      // Adding the wrong solved questions to db
      results.unsolvedIndex[key].forEach(wrongQuestionIndex => {
        if (playerProps[userId].databaseId === 'bot_id') return
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
    })

    logger.info(`Ranked game ends with p1: ${winLoseDrawAndPoints[0].status} and p2: ${winLoseDrawAndPoints[1].status} roomId: ${rankedRoomId}`)

    postMatchResults(playerList)
  }

  decideUserScores (userScores, winLoseDrawAndPoints, matchInformation, key, userId, databaseId) {
    if (userScores[userId].shouldUpdate) {
      userScores[userId].userScore.totalPoints = userScores[userId].userScore.totalPoints + winLoseDrawAndPoints[key].points
      switch (winLoseDrawAndPoints[key].status) {
        case 'won':
          userScores[userId].userScore.totalRankedWin++
          break
        case 'lost':
          userScores[userId].userScore.totalRankedLose++
          break
        case 'draw':
          userScores[userId].userScore.totalRankedDraw++
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
        totalPoints: winLoseDrawAndPoints[key].points,
        totalRankedWin: win,
        totalRankedLose: lose,
        totalRankedDraw: draw
      }).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot post userScore')
        logger.error(error.stack)
      })
    }
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

  decideUserGoals (databaseId, subjectId, solvedQuestionAmount) {
    if (solvedQuestionAmount === 0) return
    getOneUserGoal(databaseId, subjectId).then(data => {
      if (data) {
        data.questionSolved += solvedQuestionAmount

        updateUserGoals(data).catch(error => logger.error(error.stack))
      }
    }).catch(error => logger.error(error.stack))
  }

  decideUserInformationTotalPoints (userInformation, earnedPoints) {
    if (earnedPoints === 0) return
    userInformation.totalPoints += earnedPoints
    updateUserTotalPoints(userInformation).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot put user')
      logger.error(error.stack)
    })
  }

  // This is used for deciding if the users had draw, one of them wins and the other loses and calculates their points
  decideWinLoseDrawAndPoints (results, resultsKeys, examId) {
    const winLoseDrawAndPoints = []
    let net
    const netList = []
    let points
    const pointsList = []

    resultsKeys.forEach(key => {
      points = results[key].correct * CORRECT_ANSWER_MULTIPLIER
      if (examId !== 1) {
        net = results[key].correct - results[key].incorrect / 4
      } else {
        net = results[key].correct - results[key].incorrect / 3
      }
      // We calculate net for deciding who wins
      netList.push(net)
      pointsList.push(points)
    })

    // We push the results two times for two clients
    if (netList[0] === netList[1]) {
      winLoseDrawAndPoints.push({
        status: 'draw',
        points: pointsList[0] + FINISH_MATCH_POINT + DRAW_MATCH_POINT
      })
      winLoseDrawAndPoints.push({
        status: 'draw',
        points: pointsList[1] + FINISH_MATCH_POINT + DRAW_MATCH_POINT
      })
    } else if (netList[0] > netList[1]) {
      winLoseDrawAndPoints.push({
        status: 'won',
        points: pointsList[0] + FINISH_MATCH_POINT + WIN_MATCH_POINT
      })
      winLoseDrawAndPoints.push({
        status: 'lost',
        points: pointsList[1] + FINISH_MATCH_POINT
      })
    } else {
      winLoseDrawAndPoints.push({
        status: 'lost',
        points: pointsList[0] + FINISH_MATCH_POINT
      })
      winLoseDrawAndPoints.push({
        status: 'won',
        points: pointsList[1] + FINISH_MATCH_POINT + WIN_MATCH_POINT
      })
    }

    return winLoseDrawAndPoints
  }

  resetRoom () {
    const playerIds = Object.keys(this.rankedState.playerProps)

    playerIds.forEach(element => {
      this.rankedState.playerProps[element].answers = []
    })

    this.rankedState.questionNumber = -1
    this.rankedState.questionProps = []
    this.rankedState.questionList = []
    this.rankedState.stateInformation = ''
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

class RankedRoom extends colyseus.Room {
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
    this.userScores = {}
    this.userJokers = {}
    this.userInformations = {}
    this.isBotGame = false
    this.isMatchStarted = false
  }

  // If this room is full new users will join another room
  // TODO DEPRECATED IN 0.10.8
  requestJoin (options, isNew) {
    if (isNew) {
      return (options.create && isNew)
    } else {
      const matchInformation = this.state.getMatchInformation()
      const ROOM_AVAILABILITY_CHECK = (options.create && isNew) || this.clients.length > 0
      const EXAM_COURSE_SUBJECT_CHECK = (matchInformation.examId === options.examId) &&
                                        (matchInformation.courseId === options.courseId) &&
                                        (matchInformation.subjectId === options.subjectId)
      if (ROOM_AVAILABILITY_CHECK) { // First we check if the room is available for joining
        if (EXAM_COURSE_SUBJECT_CHECK) { // Then we check if this is the same game with both players
          // Checking if the users are different
          if (this.state.isBothPlayersSame(options.databaseId)) {
            return false
          }
          return true // User can join the game
        } else { return false } // Failed exam/course/subject check
      } else { return false } // Failed room availability check
    }
  }

  onInit (options) {
    try {
      // We initialize our game here
      this.setState(new RankedGame())

      const matchInformation = {
        examId: options.examId,
        courseId: options.courseId,
        subjectId: options.subjectId
      }

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
        this.state.setMatchInformation(matchInformation)
      }).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot get questions')
        logger.error(error.stack)
      })
    } catch (error) {
      logger.error(error.stack)
    }
  }

  onJoin (client, options) {
    // If we have reached the maxClients, we lock the room for unexpected things
    if (this._maxClientsReached) { this.lock() }

    // We get user jokers from database
    // Later on we send all the joker names and ids to the client
    // If the client doesnt have a joker it will be blacked out
    getUserJoker(options.databaseId).then(userJokers => {
      this.userJokers[client.id] = []
      userJokers.forEach(userJoker => {
        this.userJokers[client.id].push({
          isUsed: false,
          joker: userJoker,
          id: userJoker.jokerId
        })
      })
    }).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot get userJoker')
      logger.error(error.stack)
    })

    // Getting user information from database
    getOneUser(options.databaseId).then(userInformation => {
      const { dataValues } = userInformation
      userInformation = dataValues
      this.userInformations[client.id] = userInformation

      // We get the user score from database
      // Check if it exists; if it is null we set shouldUpdate false, otherwise true
      // When the game ends we save it to db accordingly
      getUserScore(
        options.databaseId,
        options.examId,
        options.courseId,
        options.subjectId
      ).then(userScore => {
        if (userScore === null) {
          this.userScores[client.id] = {
            shouldUpdate: false,
            userScore: userScore
          }
        } else {
          this.userScores[client.id] = {
            shouldUpdate: true,
            userScore: userScore
          }
        }

        // Finally adding the player to our room state
        if (this.state.addPlayer(client.id, userInformation, this.userScores, false)) this.addedUserNumber++

        if (this.addedUserNumber === 2) {
          // We send the clients player information
          this.clock.setTimeout(() => {
            this.broadcast(this.state.getPlayerProps())
          }, 500)
          logger.info(`Ranked game starts with p1: ${this.state.getPlayerProps()[this.state.getPlayerId(1)].databaseId} and p2: ${this.state.getPlayerProps()[this.state.getPlayerId(2)].databaseId}`)
        }
      }).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot get userScore')
        logger.error(error.stack)
      })
    }).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot get user')
      logger.error(error.stack)
    })
  }

  // TODO Move the actions into their own functions
  onMessage (client, data) {
    try {
      const that = this
      switch (data.action) {
      // Players send 'ready' action to server for letting it know that they are ready for the game
        case 'ready':
          if (++this.readyPlayerCount === 2) {
            this.isMatchStarted = true
            // When players get the 'question' action they start the round and play.
            // This delay will be longer due to pre-match player showcases.
            /* setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 3000) */
            // We set a timeout for bot
            if (this.isBotGame) {
              let botAnswer = Math.floor((Math.random() * 6) + 1)
              let botTimer = Math.floor(((Math.random() * 20) + 15) * 1000)

              this.clock.setTimeout(() => {
                // Bot answers the question
                this.state.setPlayerAnswerResults(BOT_CLIENT_ID, botAnswer)
                // If the user answered before the bot
                // We make them resend finished action again
                if (++this.finishedPlayerCount === 2) {
                  this.finishedPlayerCount--
                  this.broadcast({
                    action: 'resend-finished'
                  })
                }
              }, botTimer)
            }

            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }
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
              this.clock.setTimeout(() => {
                this.state.changeStateInformation('match-finished')
                this.isMatchFinished = true
                // We save the results after the match is finished
                this.state.saveMatchResults(this.roomId, this.userScores, this.userJokers, this.userInformations)

                if (this.isBotGame) {
                  let clientLeaveTimer = Math.floor((Math.random() * 5000) + 1500)

                  this.clock.setTimeout(() => {
                    this.broadcast({
                      action: 'client-leaving'
                    })
                  }, clientLeaveTimer)
                }
              }, 5000)
              break
            }
            // If both players are finished, we reset the round for them and start another round.
            this.finishedPlayerCount = 0
            this.state.changeStateInformation('show-results')
            // Delay for showing the results
            this.clock.setTimeout(() => {
              that.state.nextQuestion()
              that.state.changeStateInformation('question')

              if (this.isBotGame) {
                let botAnswer = Math.floor((Math.random() * 6) + 1)
                let botTimer = Math.floor(((Math.random() * 20) + 15) * 1000)

                this.clock.setTimeout(() => {
                  this.state.setPlayerAnswerResults(BOT_CLIENT_ID, botAnswer)
                  if (++this.finishedPlayerCount === 2) {
                    this.finishedPlayerCount--
                    this.broadcast({
                      action: 'resend-finished'
                    })
                  }
                }, botTimer)
              }
            }, 5000)
          }
          break
          // 'button-press' action is sent when a player presses a button
        case 'button-press':
          this.state.setPlayerAnswerResults(client.id, data.button)
          break
        case 'remove-options-joker':
          // We mark the joker as used
          if (this.userJokers[client.id] !== null) {
            let index = this.userJokers[client.id].findIndex(x => x.id === data.jokerId)
            if (this.userJokers[client.id][index].joker.amount === 0) {
              this.send(client, {
                action: 'error-joker'
              })
              break
            }
            this.userJokers[client.id][index].isUsed = true
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
          if (this.userJokers[client.id] !== null) {
            let index = this.userJokers[client.id].findIndex(x => x.id === data.jokerId)
            if (this.userJokers[client.id][index].joker.amount === 0) {
              this.send(client, {
                action: 'error-joker'
              })
              break
            }
            this.userJokers[client.id][index].isUsed = true
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
          if (this.userJokers[client.id] !== null) {
            let index = this.userJokers[client.id].findIndex(x => x.id === data.jokerId)
            if (this.userJokers[client.id][index].joker.amount === 0) {
              this.send({
                action: 'error-joker'
              })
              break
            }
            this.userJokers[client.id][index].isUsed = true

            this.send(client, {
              action: 'see-opponent-answer-joker'
            })
          }
          break
        case 'replay':
          this.clients.forEach(element => {
            if (element.id !== client.id) {
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

          this.readyPlayerCount = 0
          this.finishedPlayerCount = 0
          this.isMatchFinished = false

          // Fetching questions from database
          getMultipleQuestions(
            this.state.getMatchInformation().examId,
            this.state.getMatchInformation().courseId,
            this.state.getMatchInformation().subjectId,
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
          break
        case 'start-with-bot':
          // We set the game as bot game
          this.isBotGame = true

          const userInformation = {}
          userInformation.username = BOT_USERNAME
          userInformation.id = BOT_ID
          userInformation.profilePicture = BOT_PROFILE_PICTURE
          userInformation.coverPicture = BOT_COVER_PICTURE
          userInformation.city = BOT_CITY
          // Adding the bot to our props
          this.state.addPlayer(BOT_CLIENT_ID, userInformation, this.userScores, true)

          // Lock the room as usual and broadcast the props
          this.lock()
          // We send the clients player information
          this.clock.setTimeout(() => {
            this.readyPlayerCount++
            this.broadcast(this.state.getPlayerProps())
          }, 500)
          logger.info(`Ranked game with bot starts with p: ${this.state.getPlayerProps()[this.state.getPlayerId(1)].databaseId}`)
          break
        case 'leave-match':
          this.isMatchFinished = true
          this.send(client, {
            action: 'leave-match',
            clientId: client.id,
            playerProps: this.state.getPlayerProps(),
            fullQuestionList: this.state.getQuestionProps()
          })
          this.state.saveUnfinishedMatchResults(client.id, this.roomId, this.userScores, this.userJokers, this.userInformations)
          break
        case 'ping':
          this.send(client, { action: 'ping' })
          break
      }
    } catch (error) {
      logger.error(error.stack)
    }
  }

  onLeave (client, consented) {
    try {
      logger.info({
        message: 'Client leaving',
        clientId: client.id,
        consented: consented
      })
      if (!this.isMatchStarted) return
      // TODO add errors on all of these events
      // If the room is not empty
      if (this.clients.length !== 0) {
        const lastClient = this.clients[0]

        this.send(lastClient, {
          action: 'client-leaving',
          clientId: lastClient.id,
          playerProps: this.state.getPlayerProps(),
          fullQuestionList: this.state.getQuestionProps()
        })

        // We save the leaving clients id to mark it as lost for later
        this.leavingClientId = client.id

        // If the match was still going on
        if (!this.isMatchFinished) {
          // We send the leaving clients id
          // We do different stuff if the client has left before the match ends
          this.state.saveUnfinishedMatchResults(this.leavingClientId, this.roomId, this.userScores, this.userJokers, this.userInformations)
        }
      } else {
        if (!this.isMatchFinished && this.isBotGame) this.state.saveUnfinishedMatchResults(client.id, this.roomId, this.userScores, this.userJokers, this.userInformations)
      }
    } catch (error) {
      logger.error(error.stack)
    }
  }

  onDispose () {

  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(RankedState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(RankedRoom)

exports.rankedRoom = RankedRoom
