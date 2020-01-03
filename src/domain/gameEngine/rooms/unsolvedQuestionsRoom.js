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
  deleteUnsolvedQuestion,
  getUnsolvedQuestions,
  updateUserGoals,
  getOneUserGoal
} = require('../../../interfaces/databaseInterface/interface')
const {
  calculateResultsSolo
} = require('./helper')

// A placeholder variable for the empty option
const emptyAnswer = 6

class UnsolvedQuestionsState {
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

class UnsolvedQuestionsGame {
  constructor () {
    this.unsolvedQuestionsState = new UnsolvedQuestionsState(
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
    this.unsolvedQuestionsState.playerProps = {
      username: userInformation.username,
      answers: [],
      databaseId: userInformation.id,
      profilePicture: userInformation.profilePicture,
      coverPicture: userInformation.coverPicture,
      examId: this.unsolvedQuestionsState.matchInformation.examId
    }
    this.unsolvedQuestionsState.playerId = clientId
  }

  // Sets the player answers then sends a response to our client
  setPlayerAnswerResults (button) {
    this.unsolvedQuestionsState.playerProps.answers.push({
      answer: button,
      result: this.checkAnswer(button),
      correctAnswer: this.getQuestionAnswer()
    })

    this.changeStateInformation('result')
  }

  // Checks the players answer and returns the proper response
  checkAnswer (playerAnswer) {
    const questionProps = this.unsolvedQuestionsState.questionProps[this.unsolvedQuestionsState.questionNumber]

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
    this.unsolvedQuestionsState.questionProps = questionProps
    this.unsolvedQuestionsState.questionList = questionList
  }

  nextQuestion () {
    this.unsolvedQuestionsState.questionNumber++
  }

  setMatchInformation (matchInformation) {
    this.unsolvedQuestionsState.matchInformation = matchInformation
  }

  getMatchInformation () {
    return this.unsolvedQuestionsState.matchInformation
  }

  changeStateInformation (state) {
    this.unsolvedQuestionsState.stateInformation = state
  }

  getQuestionProps () {
    return this.unsolvedQuestionsState.questionProps
  }

  getQuestionNumber () {
    return this.unsolvedQuestionsState.questionNumber
  }

  getQuestionAnswer () {
    return this.unsolvedQuestionsState.questionProps[this.unsolvedQuestionsState.questionNumber].correctAnswer
  }

  getPlayerProps () {
    return this.unsolvedQuestionsState.playerProps
  }

  // Calculates the number of different answers and returns it
  // This function also returns wrong answered questions index
  getTotalResults () {
    // We send player and get back the results
    const returnData = calculateResultsSolo(this.unsolvedQuestionsState.playerProps)

    return returnData
  }

  // This function is used for the remove options joker
  // Already disabled variable is used to chech if the client has an already disabled button when this joker is pressed
  // We don't pick that option when choosing which options to remove
  removeOptionsJokerPressed (alreadyDisabled) {
    let disabledButton
    // We check if the user has a disabled button. We don't include it if we have one
    alreadyDisabled === undefined ? disabledButton = true : disabledButton = alreadyDisabled

    const examId = this.unsolvedQuestionsState.matchInformation.examId
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
      this.decideUserGoals(playerProps.databaseId, matchInformation.subjectId, results.resultList[key].correct + results.resultList[key].incorrect)
    })

    if (Object.keys(results.solvedIndex).length !== 0) {
      const correctlyAnsweredQuestionIds = []
      // Deleting the correctly solved questions from unsolved table
      results.solvedIndex.forEach(correctlyAnsweredIndex => {
        correctlyAnsweredQuestionIds.push(questionProps[correctlyAnsweredIndex].id)
      })
      deleteUnsolvedQuestion(playerProps.databaseId, correctlyAnsweredQuestionIds).catch(error => logger.error(error.stack))
    }

    logger.info(`Unsolved questions mode ends with player: ${playerProps.databaseId} roomId: ${soloModeRoomId}`)

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

  decideUserGoals (databaseId, subjectId, solvedQuestionAmount) {
    if (solvedQuestionAmount === 0) return
    getOneUserGoal(databaseId, subjectId).then(data => {
      if (data) {
        data.questionSolved += solvedQuestionAmount

        updateUserGoals(data).catch(error => logger.error(error.stack))
      }
    })
  }

  resetRoom () {
    this.unsolvedQuestionsState.playerProps.answers = []
    this.unsolvedQuestionsState.questionNumber = -1
    this.unsolvedQuestionsState.questionProps = []
    this.unsolvedQuestionsState.questionList = []
    this.unsolvedQuestionsState.stateInformation = ''
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

class UnsolvedQuestionsRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 1
    this.readyPlayerCount = 0
    this.questionAmount = 5
    this.userJokers = []
    this.userScores = {}
    this.isQuestionsAvailable = false
  }

  onInit (options) {
    try {
      // We initialize our game here
      this.setState(new UnsolvedQuestionsGame())

      const matchInformation = {
        examId: options.examId,
        courseId: options.courseId,
        subjectId: options.subjectId
      }

      // Fetching questions from database
      getUnsolvedQuestions(
        options.databaseId,
        options.examId,
        options.courseId,
        options.subjectId,
        this.questionAmount
      ).then(questionProps => {
        // If we dont have any questions to show, we end the game
        if (Object.keys(questionProps).length !== 0) this.isQuestionsAvailable = true
        if (!this.isQuestionsAvailable) {
          this.broadcast({ action: 'no-questions' })
          return
        }
        // If we have less than 5 questions we set the question variable again
        if (Object.keys(questionProps).length !== this.questionAmount) this.questionAmount = Object.keys(questionProps).length

        const questionList = []
        const props = []
        // Getting only the question links
        questionProps.forEach(element => {
          const { dataValues } = element.question
          element = dataValues

          props.push(element)
          questionList.push(element.questionLink)
        })
        // Setting general match related info
        this.state.setQuestions(props, questionList)
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
    try {
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

        logger.info(`Unsolved questions mode starts with player: ${this.state.getPlayerProps().databaseId}`)
      }).catch(error => {
        logger.error('GAME ENGINE INTERFACE => Cannot get user')
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
          that.state.nextQuestion()
          that.state.changeStateInformation('question')
          break
          // 'finished' action is sent after a player answers a question.
        case 'finished':
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

            logger.info(`Wrong questions mode replay with player: ${this.state.getPlayerProps().databaseId} roomId: ${this.roomId}`)
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

      // If the match was still going on
      if (!this.isMatchFinished && this.isQuestionsAvailable) {
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
colyseus.nosync(UnsolvedQuestionsState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(UnsolvedQuestionsRoom)

exports.unsolvedQuestionsRoom = UnsolvedQuestionsRoom
