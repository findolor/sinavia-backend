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
  deleteUserJoker,
  getUserScore,
  putUserScore,
  postUserScore
} = require('../../../interfaces/databaseInterface/interface')
const {
  calculateResults
} = require('./helper')

// A placeholder variable for the empty option
const emptyAnswer = 6

// TODO add log to all events
class GroupState {
  constructor (
    playerIdList,
    questionProps,
    questionList,
    questionNumber,
    matchInformation,
    stateInformation,
    playerProps
  ) {
    this.playerIdList = playerIdList
    this.questionProps = questionProps
    this.questionList = questionList
    this.questionNumber = questionNumber
    this.matchInformation = matchInformation
    this.stateInformation = stateInformation
    this.playerProps = playerProps
  }
}

class GroupGame {
  constructor () {
    this.groupState = new GroupState(
      [], // playerId list
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
    // This is how a client is representted in group game
    this.groupState.playerProps[clientId] = {
      username: userInformation.username,
      answers: [],
      databaseId: databaseId,
      profilePicture: userInformation.profilePicture,
      readyStatus: false,
      isLeft: false,
      isLeader: false
    }
    this.groupState.playerIdList.push(clientId)
    if (Object.keys(this.groupState.playerIdList).length === 1) {
      this.groupState.playerProps[clientId].readyStatus = true
      this.groupState.playerProps[clientId].isLeader = true
    }
  }

  // Sets the players answers then sends a response to our client
  setPlayerAnswerResults (clientId, button) {
    this.groupState.playerProps[clientId].answers.push({
      answer: button,
      result: this.checkAnswer(button),
      correctAnswer: this.getQuestionAnswer()
    })

    this.changeStateInformation('result')
  }

  // Checks the players answer and returns the proper response
  checkAnswer (playerAnswer) {
    const questionProps = this.groupState.questionProps[this.groupState.questionNumber]

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
    this.groupState.questionProps = questionProps
    this.groupState.questionList = questionList
  }

  nextQuestion () {
    this.groupState.questionNumber++
  }

  setMatchInformation (matchInformation) {
    this.groupState.matchInformation = matchInformation
  }

  getMatchInformation () {
    return this.groupState.matchInformation
  }

  changeStateInformation (state) {
    this.groupState.stateInformation = state
  }

  getQuestionNumber () {
    return this.groupState.questionNumber
  }

  getQuestionAnswer () {
    return this.groupState.questionProps[this.groupState.questionNumber].correctAnswer
  }

  getPlayerProps () {
    return this.groupState.playerProps
  }

  setPlayerProps (playerProps) {
    this.groupState.playerProps = playerProps
  }

  setPlayerIdList (playerIdList) {
    this.groupState.playerIdList = playerIdList
  }

  getPlayerId (playerNumber) {
    return this.groupState.playerIdList[playerNumber - 1]
  }

  getPlayerIdList () {
    return this.groupState.playerIdList
  }

  // Calculates the number of different answers and returns it
  getTotalResults () {
    const playerList = []

    this.groupState.playerIdList.forEach(playerId => {
      playerList.push(this.groupState.playerProps[playerId])
    })

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

    const examId = this.groupState.matchInformation.examId
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

  // TODO Add points logic like in ranked
  // This will not work now
  saveMatchResults (groupRoomId, userJokers, userScores) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()

    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results)

    const playerList = []

    // Need to add more attributes like point, gameResult
    resultsKeys.forEach(key => {
      // parseInt is used for converting '0' to 0
      let userId = this.getPlayerId(parseInt(key, 10) + 1)

      playerList.push({
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        correctNumber: results[key].correct,
        incorrectNumber: results[key].incorrect,
        unansweredNumber: results[key].unanswered,
        userId: playerProps[userId].databaseId
      })

      this.decideUserJokers(userJokers, userId, playerProps[userId].databaseId)
      this.decideUserScores(userScores, matchInformation, userId, playerProps[userId].databaseId)
    })

    logger.info(`Group game ends roomId: ${groupRoomId}`)

    postMatchResults(playerList)
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

  decideUserScores (userScores, matchInformation, userId, databaseId) {
    if (userScores[userId].shouldUpdate) {
      userScores[userId].userScore.totalGroupGames++
      updateUserScore(userScores[userId].userScore)
    } else {
      createUserScore({
        userId: databaseId,
        examId: matchInformation.examId,
        subjectId: matchInformation.subjectId,
        courseId: matchInformation.courseId,
        totalPoints: 0,
        totalGroupGames: 1
      })
    }
  }

  // TODO need to implement replay logic for group
  // This code might change later
  resetRoom () {
    const playerIds = Object.keys(this.groupState.playerProps)

    playerIds.forEach(element => {
      this.groupState.playerProps[element].answers = []
    })

    this.groupState.questionNumber = -1
    this.groupState.questionProps = []
    this.groupState.questionList = []
    this.groupState.stateInformation = ''
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

class GroupRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 30
    this.readyPlayerCount = 0
    this.finishedPlayerCount = 0
    this.questionAmount = 3
    this.isMatchFinished = false
    this.isMatchStarted = false
    this.joinedPlayerNum = 0
    this.userJokers = {}
    this.userScores = {}
  }

  // TODO USE THE NEW FUNCTIONS
  onInit (options) {
    // We initialize our game here
    this.setState(new GroupGame())

    const matchInformation = {
      examId: options.examId,
      courseId: options.courseId,
      subjectId: options.subjectId,
      roomCode: options.roomCode
    }

    this.state.setMatchInformation(matchInformation)
  }

  // If this room is full new users will join another room
  // There is only a room code check here
  // No need to check for exam/subject/course names
  requestJoin (options, isNew) {
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
      // Finally adding the player to our room state
      this.state.addPlayer(client.id, userInformation, options.databaseId)
      // We send the clients player information
      setTimeout(() => {
        this.broadcast({
          action: 'player-props',
          playerProps: this.state.getPlayerProps()
        })
      }, 500)
    }).catch(error => {
      logger.error(error.stack)
    })

    if (this._maxClientsReached) {
      // If we have reached the maxClients, we lock the room for unexpected things
      this.lock()
    }
  }

  // TODO Move the actions into their own functions
  async onMessage (client, data) {
    const that = this
    switch (data.action) {
      // Players send 'ready' action to server for letting it know that they are ready for the game
      case 'ready':
        if (++this.readyPlayerCount === this.clients.length) {
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
        if (++this.finishedPlayerCount === this.clients.length) {
          // We check if this is the last question
          // We extract one because questionNumber started from -1
          if (this.state.getQuestionNumber() === this.questionAmount - 1) {
            this.state.changeStateInformation('show-results')
            // Like always there is a delay to show the answers
            setTimeout(() => {
              this.state.changeStateInformation('match-finished')
              this.isMatchFinished = true
              // We save the results after the match is finished
              this.state.saveMatchResults(this.roomId, this.userJokers, this.userScores)
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
      // Users presses ready to mark them as ready
      // Can be pressed again to mark as not ready
      case 'ready-status':
        const props = this.state.getPlayerProps()
        // If the ready status is true we change it to false
        // Then we send the client infos to clients
        if (props[client.id].readyStatus) {
          props[client.id].readyStatus = false
          this.broadcast({
            action: 'player-props',
            playerProps: props
          })
        } else {
          props[client.id].readyStatus = true
          this.broadcast({
            action: 'player-props',
            playerProps: props
          })
        }
        break
      // The leader presses start
      case 'start-match':
        if (this.clients.length === 2) break
        this.isMatchStarted = true

        const matchInformation = this.state.getMatchInformation()

        // Fetching questions from database
        getQuestions(
          matchInformation.examId,
          matchInformation.courseId,
          matchInformation.subjectId,
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

        this.broadcast({
          action: 'start-match'
        })

        let logString = `Game starts with `

        const playerIdList = this.state.getPlayerIdList()

        playerIdList.forEach((playerId, index) => {
          logString += `p${index + 1}: ${this.state.getPlayerProps()[playerId].databaseId} `
        })

        logger.info(logString + `roomId: ${this.roomId}`)

        break
      // The leader can choose from different number of question amounts.
      case 'set-question-number':
        this.questionAmount = data.questionAmount
        break
    }
  }

  // TODO implement a different logic
  onLeave (client, consented) {
    logger.info({
      message: 'Client leaving',
      clientId: client.id,
      consented: consented
    })

    // If there was only the leader in the game we don't do anything and just end the game
    if (this.clients.length === 0) return

    const playerProps = this.state.getPlayerProps()
    const playerIdList = this.state.getPlayerIdList()
    // We get the second players Id
    // The next user in the player list will be the leader
    const secondPlayerId = this.state.getPlayerId(2)

    // If the leaving client is the leader we give the second player in the list leadership
    if (playerProps[client.id].isLeader) {
      playerProps[client.id].isLeader = false
      playerProps[secondPlayerId].isLeader = true
      playerProps[secondPlayerId].readyStatus = 'Hazır'
    }

    // If the match started prior to client leaving, we don't delete the client object but mark it as left
    // This is because even if the client leaves, we still add the results to our database
    if (this.isMatchStarted) playerProps[client.id].isLeft = true
    else {
      // If the match hasn't started yet, we just delete the client object and move on
      delete playerProps[client.id]
      delete this.userJokers[client.id]
      const index = playerIdList.indexOf(client.id)
      playerIdList.splice(index, 1)
    }

    this.state.changeStateInformation('player-props')
    this.state.setPlayerProps(playerProps)
    this.state.setPlayerIdList(playerIdList)

    // We broadcast all the players info to update the group list at clients end
    this.broadcast({
      action: 'player-props',
      playerProps: this.state.getPlayerProps()
    })

    // If there are more players than one, we send all of them "client-leaving" signal
    if (this.clients.length !== 1) {
      this.broadcast({
        action: 'client-leaving'
      })
    } else {
      // If everyone left the game but one client, we send "only-client" signal to it
      this.send(this.clients[0], {
        action: 'only-client'
      })
    }

    // If everyone answered but the leaving client, we subtract one from finishedPlayerCount
    // The reason is because there aren't any players to send the ffinish signal, the round will never finish.
    // So we subtract one and send the first client in the list to resend the finish signal again.
    // This allows the game to continue as normal
    if (this.finishedPlayerCount === this.clients.length) {
      this.finishedPlayerCount--
      this.send(this.clients[0], {
        action: 'finished-resend'
      })
    }
  }

  onDispose () {
    logger.info('Room disposed')
    // Because there are no winners and losers in this game mode, it doesn't matter if we save the match results right before the room closes
    // If the match hasn't started yet, we don't save any result because there aren't any lol
    if (!this.isMatchFinished && this.isMatchStarted) {
      this.state.saveMatchResults(this.roomId, this.userJokers, this.userScores)
    }
  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(GroupState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(GroupRoom)

exports.groupRoom = GroupRoom
