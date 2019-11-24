const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  getMultipleQuestions,
  postStatistic,
  getOneUser,
  getUserJoker,
  putUserJoker,
  getUserScore,
  putUserScore,
  postUserScore,
  postUnsolvedQuestion
} = require('../../../interfaces/databaseInterface/interface')
const {
  calculateResultsSolo
} = require('./helper')

// A placeholder variable for the empty option
const emptyAnswer = 6

class SoloModeState {
  constructor (
    playerId,
    questionProps,
    questionList,
    questionNumber,
    matchInformation,
    stateInformation,
    playerProps
  ) {
    this.playerId = playerId
    this.questionProps = questionProps
    this.questionList = questionList
    this.questionNumber = questionNumber
    this.matchInformation = matchInformation
    this.stateInformation = stateInformation
    this.playerProps = playerProps
  }
}

class SoloModeGame {
  constructor () {
    this.soloModeState = new SoloModeState(
      '', // player id
      [], // question props
      [], // question list
      -1, // current question number
      {}, // match information (exam, course, subject, )
      '', // state information => which action is being proccessed
      {} // general player information like username, answers, ...
    )
  }

  // Adds the player to our room state
  addPlayer (clientId, userInformation) {
    this.soloModeState.playerProps = {
      username: userInformation.username,
      answers: [],
      databaseId: userInformation.id,
      profilePicture: userInformation.profilePicture,
      coverPicture: userInformation.coverPicture,
      examId: this.soloModeState.matchInformation.examId
    }
    this.soloModeState.playerId = clientId
  }

  // Sets the player answers then sends a response to our client
  setPlayerAnswerResults (button) {
    this.soloModeState.playerProps.answers.push({
      answer: button,
      result: this.checkAnswer(button),
      correctAnswer: this.getQuestionAnswer()
    })

    this.changeStateInformation('result')
  }

  // Checks the players answer and returns the proper response
  checkAnswer (playerAnswer) {
    const questionProps = this.soloModeState.questionProps[this.soloModeState.questionNumber]

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
    this.soloModeState.questionProps = questionProps
    this.soloModeState.questionList = questionList
  }

  nextQuestion () {
    this.soloModeState.questionNumber++
  }

  setMatchInformation (matchInformation) {
    this.soloModeState.matchInformation = matchInformation
  }

  getMatchInformation () {
    return this.soloModeState.matchInformation
  }

  changeStateInformation (state) {
    this.soloModeState.stateInformation = state
  }

  getQuestionProps () {
    return this.soloModeState.questionProps
  }

  getQuestionNumber () {
    return this.soloModeState.questionNumber
  }

  getQuestionAnswer () {
    return this.soloModeState.questionProps[this.soloModeState.questionNumber].correctAnswer
  }

  getPlayerProps () {
    return this.soloModeState.playerProps
  }

  // Calculates the number of different answers and returns it
  // This function also returns wrong answered questions index
  getTotalResults () {
    // We send player and get back the results
    const returnData = calculateResultsSolo(this.soloModeState.playerProps)

    return returnData
  }

  // This function is used for the remove options joker
  // Already disabled variable is used to chech if the client has an already disabled button when this joker is pressed
  // We don't pick that option when choosing which options to remove
  removeOptionsJokerPressed (alreadyDisabled) {
    let disabledButton
    // We check if the user has a disabled button. We don't include it if we have one
    alreadyDisabled === undefined ? disabledButton = true : disabledButton = alreadyDisabled

    const examId = this.soloModeState.matchInformation.examId
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

  // This is called when the game ended normally without any clients leaving
  saveMatchResults (soloModeRoomId, userJokers, userScores) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()
    const questionProps = this.getQuestionProps()

    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results.resultList)

    const playerList = []

    resultsKeys.forEach(key => {
      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results.resultList[key].correct,
        incorrectNumber: results.resultList[key].incorrect,
        unansweredNumber: results.resultList[key].unanswered,
        // parseInt is used for converting '0' to 0
        userId: playerProps.databaseId,
        gameModeType: 'solo'
      })

      this.decideUserJokers(userJokers)
      this.decideUserScores(userScores, matchInformation, playerProps.databaseId)
    })

    // Adding the wrong solved questions to db
    results.unsolvedIndex.forEach(wrongQuestionIndex => {
      postUnsolvedQuestion({
        userId: playerProps.databaseId,
        questionId: questionProps[wrongQuestionIndex].id
      }).catch(error => {
        if (error.message !== 'Validation error') {
          logger.error('GAME ENGINE INTERFACE => Cannot post unsolvedQuestion')
          logger.error(error.stack)
        }
      })
    })

    logger.info(`Solo game ends with player: ${playerProps.databaseId} roomId: ${soloModeRoomId}`)

    postMatchResults(playerList)
  }

  decideUserJokers (userJokers) {
    if (userJokers !== null) {
      userJokers.forEach(userJoker => {
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

  decideUserScores (userScores, matchInformation, databaseId) {
    if (userScores.shouldUpdate) {
      userScores.userScore.totalSoloGames++
      putUserScore(userScores.userScore).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot put userScore')
        logger.error(error.stack)
      })
    } else {
      postUserScore({
        userId: databaseId,
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        totalPoints: 0,
        totalSoloGames: 1
      }).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot post userScore')
        logger.error(error.stack)
      })
    }
  }

  resetRoom () {
    this.soloModeState.playerProps.answers = []
    this.soloModeState.questionNumber = -1
    this.soloModeState.questionProps = []
    this.soloModeState.questionList = []
    this.soloModeState.stateInformation = ''
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

class SoloModeRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 1
    this.readyPlayerCount = 0
    this.questionAmount = null
    this.userJokers = []
    this.userScores = {}
  }

  onInit (options) {
    // We initialize our game here
    this.setState(new SoloModeGame())

    const matchInformation = {
      examId: options.examId,
      courseId: options.courseId,
      subjectId: options.subjectId
    }

    this.questionAmount = options.choosenQuestionAmount

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
  }

  onJoin (client, options) {
    // We get user jokers from database
    // Later on we send all the joker names and ids to the client
    // If the client doesnt have a joker it will be blacked out
    getUserJoker(options.databaseId).then(userJokers => {
      userJokers.forEach(userJoker => {
        this.userJokers.push({
          isUsed: false,
          joker: userJoker,
          id: userJoker.jokerId
        })
      })
    }).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot get userJoker')
      logger.error(error.stack)
    })

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
        this.userScores = {
          shouldUpdate: false,
          userScore: userScore
        }
      } else {
        this.userScores = {
          shouldUpdate: true,
          userScore: userScore
        }
      }
    }).catch(error => {
      logger.error('GAME ENGINE INTERFACE => Cannot get userScore')
      logger.error(error.stack)
    })

    // Getting user information from database
    getOneUser(options.databaseId).then(userInformation => {
      const { dataValues } = userInformation
      userInformation = dataValues
      // Finally adding the player to our room state
      this.state.addPlayer(client.id, userInformation)

      logger.info(`Solo game starts with player: ${this.state.getPlayerProps().databaseId}`)
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
          that.state.nextQuestion()
          that.state.changeStateInformation('question')
          break
          // 'finished' action is sent after a player answers a question.
        case 'finished':
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
              this.state.saveMatchResults(this.roomId, this.userJokers, this.userScores)
            }, 5000)
            break
          }
          this.state.changeStateInformation('show-results')
          // Delay for showing the results
          this.clock.setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 5000)
          break
          // 'button-press' action is sent when a player presses a button
        case 'button-press':
          this.state.setPlayerAnswerResults(data.button)
          break
        case 'remove-options-joker':
          // We mark the joker as used
          if (this.userJokers !== null) {
            let index = this.userJokers.findIndex(x => x.id === data.jokerId)
            if (this.userJokers[index].joker.amount === 0) {
              this.send(client, {
                action: 'error-joker'
              })
              break
            }
            this.userJokers[index].isUsed = true
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
          if (this.userJokers !== null) {
            let index = this.userJokers.findIndex(x => x.id === data.jokerId)
            if (this.userJokers[index].joker.amount === 0) {
              this.send(client, {
                action: 'error-joker'
              })
              break
            }
            this.userJokers[index].isUsed = true
          }

          const questionAnswer = this.state.getQuestionAnswer()

          // We send the question answer to client for checking if it choose the correct option
          this.send(client, {
            action: 'second-chance-joker',
            questionAnswer: questionAnswer
          })
          break
        case 'replay':
          this.state.resetRoom()
          // Becase we are playing again, we need to update userScores this match
          // And we reset the used jokers
          this.userScores.shouldUpdate = true
          this.userJokers.forEach(userJoker => {
            userJoker.isUsed = false
          })

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

            logger.info(`Solo game replay with player: ${this.state.getPlayerProps().databaseId} roomId: ${this.roomId}`)
            this.send(client, {
              action: 'replay'
            })
          }).catch(error => {
            logger.error('GAME ENGINE INTERFACE => Cannot get questions')
            logger.error(error.stack)
          })
          break
        case 'leave-match':
          this.isMatchFinished = true
          this.send(client, {
            action: 'leave-match',
            clientId: client.id,
            playerProps: this.state.getPlayerProps(),
            fullQuestionList: this.state.getQuestionProps()
          })
          this.state.saveMatchResults(this.roomId, this.userJokers, this.userScores)
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

      // If the match was still going on
      if (!this.isMatchFinished) {
        this.state.saveMatchResults(this.roomId, this.userJokers, this.userScores)
      }
    } catch (error) {
      logger.error(error.stack)
    }
  }

  onDispose () {

  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(SoloModeState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(SoloModeRoom)

exports.soloModeRoom = SoloModeRoom
