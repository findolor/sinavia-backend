const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  postStatistic,
  getOneUser,
  getUserJoker,
  deleteUserJoker,
  putUserJoker,
  updateOngoingMatch,
  getOngoingMatch
} = require('../../../interfaces/databaseInterface/interface')
const {
  calculateResultsSolo
} = require('./helper')
const cronJob = require('../../../infra/cron')
const nodeCache = require('../../../infra/cache')

// A placeholder variable for the empty option
const emptyAnswer = 6

// TODO TAKE A GOOD LOOK HERE AND CLEAN UP UNNECESSARY STUFF
class FriendSoloState {
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

class FriendSoloGame {
  constructor () {
    this.friendState = new FriendSoloState(
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

  getPlayerId (playerNumber) {
    switch (playerNumber) {
      case 1:
        return this.friendState.playerOneId
      case 2:
        return this.friendState.playerTwoId
    }
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

  saveSoloMatchResults (friendRoomId, userJokers) {
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
        userId: playerProps[this.getPlayerId(parseInt(key, 10) + 1)].databaseId
      })

      this.decideUserJokers(userJokers, userId, playerProps[userId].databaseId)
    })

    logger.info(`Friend solo game ends roomId: ${friendRoomId}`)

    // After posting the statistics
    // We update the ongoing game userResult field with the id from statistic
    postMatchResultsSolo(playerList).then(data => {
      updateOngoingMatch({
        id: matchInformation.ongoingMatchId,
        friendResults: data.id
      }).then(data => {
        cronJob({ logger, nodeCache }).stopOngoingMatchCron(data.id)
      })
    })
  }

  decideUserJokers (userJokers, userId, databaseId) {
    if (userJokers[userId] !== null) {
      userJokers[userId].forEach(userJoker => {
        if (userJoker.isUsed) {
          if (userJoker.amount === 0) destroyUserJoker(databaseId, userJoker.id)
          else {
            updateUserJoker({
              userId: databaseId,
              jokerId: userJoker.id,
              amount: userJoker.amount
            })
          }
        }
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

function fetchUserJoker (userId) {
  try {
    return getUserJoker(userId)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get userJoker')
    logger.error(error.stack)
  }
}

function destroyUserJoker (userId, jokerId) {
  try {
    return deleteUserJoker(userId, jokerId)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot delete userJoker')
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

function getOngoingMatchInfo (ongoingMatchId) {
  try {
    return getOngoingMatch(ongoingMatchId)
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get ongoingMatch')
    logger.error(error.stack)
  }
}

class FriendSoloRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 1
    this.questionAmount = 3
    this.isMatchFinished = false
    this.fetchedUserInfoNumber = 0
    this.userJokers = {}
  }

  onInit (options) {
    // We initialize our game here
    this.setState(new FriendSoloGame())

    const matchInformation = {
      examId: options.examId,
      courseId: options.courseId,
      subjectId: options.subjectId,
      ongoingMatchId: options.ongoingMatchId
    }

    getOngoingMatchInfo(options.ongoingMatchId).then(data => {
      data.ongoingMatchUser = data.ongoingMatchUser.dataValues
      data.ongoingMatchFriend = data.ongoingMatchFriend.dataValues
      data.ongoingMatchUserStatistics = data.ongoingMatchUserStatistics.dataValues

      const questionList = []
      const questionProps = []

      // Getting only the question links
      data.questionList.forEach(question => {
        question = JSON.parse(question)
        questionProps.push(question)
        questionList.push(question.questionLink)
      })
      // Setting general match related info
      this.state.setQuestions(questionProps, questionList)
      this.state.setMatchInformation(matchInformation)
    })
  }

  onJoin (client, options) {
    // We get user jokers from database
    // Later on we send all the joker names and ids to the client
    // If the client doesnt have a joker it will be blacked out
    fetchUserJoker(options.databaseId).then(userJokers => {
      this.userJokers[client.id] = []
      if (Object.keys(userJokers).length !== 0) {
        userJokers.forEach(userJoker => {
          this.userJokers[client.id].push({
            isUsed: false,
            amount: userJoker.amount,
            id: userJoker.jokerId
          })
        })
      } else this.userJokers[client.id] = null
    })

    // Getting user information from database
    getUser(options.databaseId).then(userInformation => {
      const { dataValues } = userInformation
      userInformation = dataValues
      this.fetchedUserInfoNumber++
      // Finally adding the player to our room state
      this.state.addPlayer(client.id, userInformation, options.databaseId)
    })
  }

  // TODO Move the actions into their own functions
  async onMessage (client, data) {
    const that = this
    switch (data.action) {
      // Friend send 'ready-solo' action to server for letting it know that they are ready for the game
      case 'ready-solo':
        that.state.nextQuestion()
        that.state.changeStateInformation('question')
        break
      // 'finished' action is sent after a player answers a question.
      case 'finished':
        // We check if this is the last question
        // We extract one because questionNumber started from -1
        if (this.state.getQuestionNumber() === this.questionAmount - 1) {
          this.state.changeStateInformation('show-results')
          // Like always there is a delay to show the answers
          setTimeout(async () => {
            this.state.changeStateInformation('match-finished')
            this.isMatchFinished = true
            // We save the results after the match is finished
            await this.state.saveMatchResults(this.roomId, this.userJokers)
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
      case 'finished-solo':
        if (this.state.getQuestionNumber() === this.questionAmount - 1) {
          this.state.changeStateInformation('show-results')
          // Like always there is a delay to show the answers
          setTimeout(() => {
            this.state.changeStateInformation('match-finished')
            this.isMatchFinished = true
            // We save the results after the match is finished
            this.state.saveSoloMatchResults(this.roomId, this.userJokers)
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
          this.userJokers[client.id][index].isUsed = true
          this.userJokers[client.id][index].amount--
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
          this.userJokers[client.id][index].isUsed = true
          this.userJokers[client.id][index].amount--
        }

        const questionAnswer = this.state.getQuestionAnswer()

        // We send the question answer to client for checking if it choose the correct option
        this.send(client, {
          action: 'second-chance-joker',
          questionAnswer: questionAnswer
        })
        break
    }
  }

  async onLeave (client, consented) {
    logger.info({
      message: 'Client leaving',
      clientId: client.id,
      consented: consented
    })

    if (!this.isMatchFinished) this.state.saveSoloMatchResults(this.roomId, this.userJokers)
  }

  onDispose () {
    logger.info('Room disposed')
  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(FriendSoloState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(FriendSoloRoom)

exports.friendSoloRoom = FriendSoloRoom