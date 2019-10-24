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
  getUserScore,
  putUserScore,
  postUserScore,
  getFriendMatches
} = require('../../../interfaces/databaseInterface/interface')
const {
  calculateResults,
  calculateResultsSolo
} = require('./helper')
const cronJob = require('../../../infra/cron')
const nodeCache = require('../../../infra/cache')

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
    const resultList = calculateResults(playerList)
    const results = {}

    resultList.forEach((player, index) => {
      results[index] = player
    })

    return results
  }

  getTotalResultsSolo () {
    // We send playerList and get back the results
    const resultList = calculateResultsSolo(this.friendState.playerProps[this.friendState.playerOneId])
    const results = {}

    resultList.forEach((player, index) => {
      results[index] = player
    })

    return results
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

    // Result has two items. [0] is playerOne, [1] is playerTwo
    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results)

    const playerList = []
    const friendMatchInformation = {}

    // We get the results as normal
    const winLoseDraw = this.decideWinLoseDraw(results, resultsKeys, matchInformation.examId)

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
        correctNumber: results[key].correct,
        incorrectNumber: results[key].incorrect,
        unansweredNumber: results[key].unanswered,
        gameResult: winLoseDraw[key].status,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId
      })

      this.decideUserJokers(userJokers, userId)
      this.decideUserScores(userScores, winLoseDraw, matchInformation, key, userId, playerProps[userId].databaseId)
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
    await postFriendMatchResults(friendMatchInformation)
  }

  // This is called when the game ended normally without any clients leaving
  async saveMatchResults (friendRoomId, userJokers, userScores) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()

    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results)

    const playerList = []
    const friendMatchInformation = {}

    const winLoseDraw = this.decideWinLoseDraw(results, resultsKeys, matchInformation.examId)

    resultsKeys.forEach(key => {
      let userId = this.getPlayerId(parseInt(key, 10) + 1)

      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results[key].correct,
        incorrectNumber: results[key].incorrect,
        unansweredNumber: results[key].unanswered,
        gameResult: winLoseDraw[key].status,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId
      })

      this.decideUserJokers(userJokers, userId)
      this.decideUserScores(userScores, winLoseDraw, matchInformation, key, userId, playerProps[userId].databaseId)
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
    await postFriendMatchResults(friendMatchInformation)
  }

  saveSoloMatchResults (friendRoomId, userJokers, soloGameDatabaseId) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()

    const results = this.getTotalResultsSolo()

    const resultsKeys = Object.keys(results)

    const playerList = []

    resultsKeys.forEach(key => {
      let userId = this.getPlayerId(parseInt(key, 10) + 1)

      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results[key].correct,
        incorrectNumber: results[key].incorrect,
        unansweredNumber: results[key].unanswered,
        // parseInt is used for converting '0' to 0
        userId: playerProps[userId].databaseId
      })

      this.decideUserJokers(userJokers, userId)
    })

    logger.info(`Friend solo game ends roomId: ${friendRoomId}`)

    // After posting the statistics
    // We update the ongoing game userResult field with the id from statistic
    postMatchResultsSolo(playerList).then(data => {
      updateOngoingMatch({
        id: soloGameDatabaseId,
        userResults: data.id
      }).then(ongoingMatch => {
        cronJob({ logger, nodeCache }).stopOngoingMatchCron(ongoingMatch.id, true)
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

          updateUserJoker(userJoker.joker)
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
      updateUserScore(userScores[userId].userScore)
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
      createUserScore({
        userId: databaseId,
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        totalPoints: 0,
        totalFriendWin: win,
        totalFriendLose: lose,
        totalFriendDraw: draw
      })
    }
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

// Gets random numbers for given range and lenght
function getRandomUniqueNumbers (uniqueItemNumber, topNumber) {
  const arr = []
  while (arr.length < uniqueItemNumber) {
    const r = Math.floor(Math.random() * topNumber) + 1
    if (arr.indexOf(r) === -1) arr.push(r)
  }
  return arr
}

// Gets questions based on given question amount
function getQuestions (
  examId,
  courseId,
  subjectId,
  questionAmount
) {
  try {
    return getMultipleQuestions(
      examId,
      courseId,
      subjectId,
      questionAmount
    )
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get questions')
    logger.error(error.stack)
  }
}

// Gets the user information
function getUser (id) {
  try {
    return getOneUser(id)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get user')
    logger.error(error.stack)
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

// Saves the friend game match results to the database
function postFriendMatchResults (friendMatchInformation) {
  try {
    return postFriendGameMatchResult(friendMatchInformation)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot post friend match information')
    logger.error(error.stack)
  }
}

function getPlayedFriendMatches (userId, friendId) {
  try {
    return getFriendMatches(userId, friendId)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get friend match information')
    logger.error(error.stack)
  }
}

function fetchUserJoker (userId) {
  try {
    return getUserJoker(userId)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get userJoker')
    logger.error(error.stack)
  }
}

function updateUserJoker (userJokerEntity) {
  try {
    return putUserJoker(userJokerEntity)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot put userJoker')
    logger.error(error.stack)
  }
}

function fetchUserScore (
  userId,
  examId,
  courseId,
  subjectId
) {
  try {
    return getUserScore(
      userId,
      examId,
      courseId,
      subjectId
    )
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get userScore')
    logger.error(error.stack)
  }
}

function createUserScore (userScoreEntity) {
  try {
    return postUserScore(userScoreEntity)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot post userScore')
    logger.error(error.stack)
  }
}

function updateUserScore (userScoreEntity) {
  try {
    return putUserScore(userScoreEntity)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot put userScore')
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
    this.fetchedUserInfoNumber = 0
    this.userJokers = {}
    this.userScores = {}
    this.isSoloGame = false
    this.soloGameDBId = 0
  }

  onInit (options) {
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
    getQuestions(
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
      logger.error(error.stack)
    })
  }

  // If this room is full new users will join another room
  requestJoin (options, isNew) {
    if (options.rejectGame) {
      this.broadcast({
        action: 'game-reject'
      })
      this.disconnect()
    }
    if (isNew) {
      if (options.create) return true
      else return false
    } else {
      const matchInformation = this.state.getMatchInformation()
      const ROOM_CODE_CHECK = (options.roomCode === matchInformation.roomCode)

      // We check if the room code is valid
      if (ROOM_CODE_CHECK) {
        // User can join the room
        return true
        // Failed room code check
      } else { return false }
    }
  }

  onJoin (client, options) {
    const matchInformation = this.state.getMatchInformation()
    // We get user jokers from database
    // Later on we send all the joker names and ids to the client
    // If the client doesnt have a joker it will be blacked out
    // TODO Send the joker names to our client
    // SEND THIS WHEN THE APP OPENS
    fetchUserJoker(options.databaseId).then(userJokers => {
      this.userJokers[client.id] = []
      if (Object.keys(userJokers).length !== 0) {
        userJokers.forEach(userJoker => {
          this.userJokers[client.id].push({
            isUsed: false,
            joker: userJoker,
            id: userJoker.jokerId
          })
        })
      } else this.userJokers[client.id] = null
    })

    // We get the user score from database
    // Check if it exists; if it is null we set shouldUpdate false, otherwise true
    // When the game ends we save it to db accordingly
    fetchUserScore(
      options.databaseId,
      matchInformation.examId,
      matchInformation.courseId,
      matchInformation.subjectId
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
    })

    // Getting user information from database
    getUser(options.databaseId).then(userInformation => {
      const { dataValues } = userInformation
      userInformation = dataValues
      this.fetchedUserInfoNumber++
      // Finally adding the player to our room state
      this.state.addPlayer(client.id, userInformation, options.databaseId)

      if (this._maxClientsReached && this.fetchedUserInfoNumber === 2) {
        // If we have reached the maxClients, we lock the room for unexpected things
        this.lock()
        // We send the clients player information
        this.clock.setTimeout(() => {
          this.broadcast(this.state.getPlayerProps())
        }, 500)
        logger.info(`Friend game starts with p1: ${this.state.getPlayerProps()[this.state.getPlayerId(1)].databaseId} and p2: ${this.state.getPlayerProps()[this.state.getPlayerId(2)].databaseId} roomId: ${this.roomId}`)
      }
    }).catch(error => {
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
            this.state.changeStateInformation('show-results')
            // Like always there is a delay to show the answers
            setTimeout(() => {
              getPlayedFriendMatches(
                this.state.getMatchInformation().userId,
                this.state.getMatchInformation().friendId
              ).then(friendMatches => {
                this.broadcast({
                  action: 'friend-matches',
                  friendMatches: friendMatches
                })

                this.state.changeStateInformation('match-finished')
                this.isMatchFinished = true
                // We save the results after the match is finished
                this.state.saveMatchResults(this.roomId, this.userJokers, this.userScores)
              })
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
          // Like always there is a delay to show the answers
          setTimeout(() => {
            this.state.changeStateInformation('match-finished')
            this.isMatchFinished = true
            // We save the results after the match is finished
            this.state.saveSoloMatchResults(this.roomId, this.userJokers, this.soloGameDBId)
          }, 5000)
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
            this.send(client, {
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
        // TODO USE THE NEW FUNCTIONS
        this.state.resetRoom()

        this.questionAmount = 1
        this.readyPlayerCount = 0
        this.finishedPlayerCount = 0
        this.questionIdList = getRandomUniqueNumbers(this.questionAmount, 5)
        this.isMatchFinished = false

        // Fetching questions from database
        const questionProps = await getQuestions(
          this.state.getMatchInformation(),
          this.questionIdList
        )
        const questionList = []

        // Getting only the question links
        questionProps.forEach(element => {
          questionList.push(element.questionLink)
        })
        // Setting general match related info
        this.state.setQuestions(questionProps, questionList)
        break
        // TODO Make the cron here
      case 'start-ahead':
        this.isSoloGame = true
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
        cronJob({ logger, nodeCache }).makeFriendGameCronJob(
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
          }
        ).then(data => {
          // We save the id for ongoing game to update it later
          this.soloGameDBId = data
        })
        break
    }
  }

  onLeave (client, consented) {
    logger.info({
      message: 'Client leaving',
      clientId: client.id,
      consented: consented
    })

    // TODO add errors on all of these events
    // If the room is not empty
    if (this.clients.length !== 0) {
      const lastClient = this.clients[0]

      getPlayedFriendMatches(this.state.getMatchInformation().userId, this.state.getMatchInformation().friendId).then(friendMatches => {
        this.send(lastClient, {
          action: 'client-leaving',
          clientId: lastClient.id,
          playerProps: this.state.getPlayerProps(),
          fullQuestionList: this.state.getQuestionProps(),
          friendMatches: friendMatches
        })
      })

      // We save the leaving clients id to mark it as lost for later
      this.leavingClientId = client.id

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
