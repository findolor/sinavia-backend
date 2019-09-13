const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  getMultipleQuestions,
  postStatistic,
  getOneUser
  // getMatchInformation
} = require('../../../interfaces/engineInterface/interface')
const {
  calculateResults
} = require('./helper')

// A placeholder variable for the empty option
const emptyAnswer = 6
const FINISH_MATCH_POINT = 20
const WIN_MATCH_POINT = 100
const CORRECT_ANSWER_MULTIPLIER = 20
const DRAW_MATCH_POINT = 50

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
  addPlayer (clientId, userInformation, databaseId) {
    this.rankedState.playerProps[clientId] = {
      username: userInformation.username,
      answers: [],
      databaseId: databaseId,
      profilePicture: userInformation.profilePicture,
      coverPicture: userInformation.coverPicture
    }
    this.rankedState.playerOneId === '' ? this.rankedState.playerOneId = clientId : this.rankedState.playerTwoId = clientId
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
    const resultList = calculateResults(playerList)
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
  saveUnfinishedMatchResults (leavingClientId, rankedRoomId) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()

    // Result has two items. [0] is playerOne, [1] is playerTwo
    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results)

    const playerList = []

    // We get the results and points as normal
    const winLoseDrawAndPoints = this.decideWinLoseDrawAndPoints(results, resultsKeys, matchInformation.examId)

    // We check if the leaving client is the first client
    if (leavingClientId === this.rankedState.playerOneId) {
      // We subtract finished match point
      winLoseDrawAndPoints[0].points -= FINISH_MATCH_POINT
      winLoseDrawAndPoints[1].points -= FINISH_MATCH_POINT
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
      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results[key].correct,
        incorrectNumber: results[key].incorrect,
        unansweredNumber: results[key].unanswered,
        gameResult: winLoseDrawAndPoints[key].status,
        earnedPoints: winLoseDrawAndPoints[key].points,
        // parseInt is used for converting '0' to 0
        userId: playerProps[this.getPlayerId(parseInt(key, 10) + 1)].databaseId
      })
    })

    logger.info(`Ranked game ends with p1: ${winLoseDrawAndPoints[0].status} and p2: ${winLoseDrawAndPoints[1].status} roomId: ${rankedRoomId}`)

    postMatchResults(playerList)
  }

  // This is called when the game ended normally without any clients leaving
  saveMatchResults (rankedRoomId) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()

    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results)

    const playerList = []

    const winLoseDrawAndPoints = this.decideWinLoseDrawAndPoints(results, resultsKeys, matchInformation.examId)

    resultsKeys.forEach(key => {
      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results[key].correct,
        incorrectNumber: results[key].incorrect,
        unansweredNumber: results[key].unanswered,
        gameResult: winLoseDrawAndPoints[key].status,
        earnedPoints: winLoseDrawAndPoints[key].points,
        // parseInt is used for converting '0' to 0
        userId: playerProps[this.getPlayerId(parseInt(key, 10) + 1)].databaseId
      })
    })

    logger.info(`Ranked game ends with p1: ${winLoseDrawAndPoints[0].status} and p2: ${winLoseDrawAndPoints[1].status} roomId: ${rankedRoomId}`)

    postMatchResults(playerList)
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
    playerList.forEach(async player => {
      await postStatistic(player)
    })
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot post statistics')
    logger.error(error.stack)
  }
}

/* function getMatchContent (examId) {
  try {
    return getMatchInformation(examId)
  } catch(error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get match information')
    logger.error(error.stack)
  }
} */

class RankedRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 2
    this.readyPlayerCount = 0
    this.finishedPlayerCount = 0
    this.questionIdList = []
    this.questionAmount = 3
    this.isMatchFinished = false
    this.leavingClientId = null
    this.joinedPlayerNum = 0
    this.fetchedUserInfoNumber = 0
    /* this.fetchedUserInfoInterval = this.clock.setInterval(() => {
      if (this._maxClientsReached && this.fetchedUserInfoNumber === 2) {
        // If we have reached the maxClients, we lock the room for unexpected things
          this.lock()
          // We send the clients player information
          setTimeout(() => {
            this.broadcast(this.state.getPlayerProps())
          }, 500)
          logger.info(`Ranked game starts with p1: ${this.state.getPlayerProps()[this.state.getPlayerId(1)].databaseId} and p2: ${this.state.getPlayerProps()[this.state.getPlayerId(2)].databaseId}`)
          this.fetchedUserInfoInterval.clear()
        }
    }, 2000) */
  }

  // If this room is full new users will join another room
  // TODO DEPRECATED IN 0.10.8
  requestJoin (options, isNew) {
    if (isNew) {
      return (options.create && isNew) || this.clients.length > 0
    } else {
      const matchInformation = this.state.getMatchInformation()
      const ROOM_AVAILABILITY_CHECK = (options.create && isNew) || this.clients.length > 0
      const EXAM_COURSE_SUBJECT_CHECK = (matchInformation.examId === options.examId) &&
                                        (matchInformation.courseId === options.courseId) &&
                                        (matchInformation.subjectId === options.subjectId)
      if (ROOM_AVAILABILITY_CHECK) { // First we check if the room is available for joining
        if (EXAM_COURSE_SUBJECT_CHECK) { // Then we check if this is the same game with both players
          return true // User can join the game
        } else { return false } // Failed exam/course/subject check
      } else { return false } // Failed room availability check
    }
  }

  onInit (options) {
    try {
      console.log(options)
      // We initialize our game here
      this.setState(new RankedGame())

      const matchInformation = {
        examId: options.examId,
        courseId: options.courseId,
        subjectId: options.subjectId
      }

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
        this.state.setMatchInformation(matchInformation)
      }).catch(error => {
        logger.error(error.stack)
      })
    } catch (error) {
      logger.error(error.stack)
    }
  }

  onJoin (client, options) {
    try {
      // if(options === undefined) return
    // Getting user information from database
      getUser(options.databaseId).then(userInformation => {
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
          logger.info(`Ranked game starts with p1: ${this.state.getPlayerProps()[this.state.getPlayerId(1)].databaseId} and p2: ${this.state.getPlayerProps()[this.state.getPlayerId(2)].databaseId}`)
        }
      }).catch(error => {
        logger.error(error.stack)
      })
    } catch (error) {
      logger.error(error.stack)
    }
  }

  // TODO Move the actions into their own functions
  onMessage (client, data) {
    try {
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
          // 'finished' action is sent after a player answers a question.
        case 'finished':
          if (++this.finishedPlayerCount === 2) {
          // We check if this is the last question
          // We extract one because questionNumber started from -1
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
              this.clock.setTimeout(() => {
                this.state.changeStateInformation('match-finished')
                this.isMatchFinished = true
                // We save the results after the match is finished
                this.state.saveMatchResults(this.roomId)
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
            }, 5000)
          }
          break
          // 'button-press' action is sent when a player presses a button
        case 'button-press':
          this.state.setPlayerAnswerResults(client.id, data.button)
          break
        case 'remove-options-joker':
          let optionsToRemove

          // If we have a disabled button before hand, we send it. Otherwise we don't
          if (data.disabled === false) { optionsToRemove = this.state.removeOptionsJokerPressed() } else { optionsToRemove = this.state.removeOptionsJokerPressed(data.disabled) }

          this.send(client, {
            action: 'remove-options-joker',
            optionsToRemove: optionsToRemove
          })
          break
        case 'second-chance-joker':
          const questionAnswer = this.state.getQuestionAnswer()

          // We send the question answer to client for checking if it choose the correct option
          this.send(client, {
            action: 'second-chance-joker',
            questionAnswer: questionAnswer
          })
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

          this.readyPlayerCount = 0
          this.finishedPlayerCount = 0
          this.isMatchFinished = false

          // Fetching questions from database
          getQuestions(
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
          })
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
      // TODO add errors on all of these events
      // If the room is not empty
      if (this.clients.length !== 0) {
        const lastClient = this.clients[0]

        this.send(lastClient, {
          action: 'client-leaving'
        })

        // We save the leaving clients id to mark it as lost for later
        this.leavingClientId = client.id

        // If the match was still going on
        if (!this.isMatchFinished) {
          // We send the leaving clients id
          // We do different stuff if the client has left before the match ends
          this.state.saveUnfinishedMatchResults(this.leavingClientId, this.roomId)
        }
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
