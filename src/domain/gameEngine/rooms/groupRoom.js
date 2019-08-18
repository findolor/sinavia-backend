const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  getMultipleQuestions,
  postStatistic,
  getOneUser
} = require('../../../interfaces/engineInterface/interface')
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

    const examName = this.groupState.matchInformation.examName
    const questionAnswer = this.getQuestionAnswer()

    const optionsToRemove = []

    let randomNumber
    let loop = 0
    let firstRandomOption = -1

    // This code piece is for 4 options
    if (examName === 'LGS') {
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
  async saveMatchResults (groupRoomId) {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()

    const results = this.getTotalResults()

    const resultsKeys = Object.keys(results)

    const playerList = []

    // Need to add more attributes like point, gameResult
    resultsKeys.forEach(key => {
      playerList.push({
        examName: matchInformation.examName,
        subjectName: matchInformation.subjectName,
        courseName: matchInformation.courseName,
        correctNumber: results[key].correct,
        incorrectNumber: results[key].incorrect,
        unansweredNumber: results[key].unanswered,
        // parseInt is used for converting '0' to 0
        userId: playerProps[this.getPlayerId(parseInt(key, 10) + 1)].databaseId
      })
    })

    logger.info(`Group game ends roomId: ${groupRoomId}`)

    await postMatchResults(playerList)
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

// Gets random numbers for given range and lenght
function getRandomUniqueNumbers (uniqueItemNumber, topNumber) {
  const arr = []
  while (arr.length < uniqueItemNumber) {
    const r = Math.floor(Math.random() * topNumber) + 1
    if (arr.indexOf(r) === -1) arr.push(r)
  }
  return arr
}

// Gets questions by providing it with random indexes
async function getQuestions (matchInformation, questionIdList) {
  try {
    const questions = await getMultipleQuestions(
      questionIdList,
      matchInformation
    )
    return questions
  } catch (error) {
  }
}

// Gets the user information
async function getUser (id) {
  try {
    const user = await getOneUser(id)
    return user
  } catch (error) {
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
  }
}

class GroupRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 30
    this.readyPlayerCount = 0
    this.finishedPlayerCount = 0
    this.questionIdList = []
    this.questionAmount = 5
    this.isMatchFinished = false
    this.isMatchStarted = false
  }

  onInit (options) {
    // We get a random list of numbers for our question fetching
    this.questionIdList = getRandomUniqueNumbers(this.questionAmount, 5)

    // We initialize our game here
    this.setState(new GroupGame())
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

  async onJoin (client, options) {
    // We don't do these steps again for a second player. Only for once
    if (this.clients.length !== 2) {
      const matchInformation = {
        examName: options.examName,
        courseName: options.courseName,
        subjectName: options.subjectName,
        roomCode: options.roomCode
      }

      this.state.setMatchInformation(matchInformation)
    }

    // Getting user information from database
    const userInformation = await getUser(options.databaseId)

    // Finally adding the player to our room state
    this.state.addPlayer(client.id, userInformation, options.databaseId)

    // We send the clients player information
    this.broadcast({
      action: 'player-props',
      playerProps: this.state.getPlayerProps()
    })

    if (this.clients.length === this.maxClients) {
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
          setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 3000)
        }
        return
      // 'finished' action is sent after a player answers a question.
      case 'finished':
        if (++this.finishedPlayerCount === this.clients.length) {
          // We check if this is the last question
          // We extract one because questionNumber started from -1
          if (this.state.getQuestionNumber() === this.questionAmount - 1) {
            this.state.changeStateInformation('show-results')
            // Like always there is a delay to show the answers
            setTimeout(async () => {
              this.state.changeStateInformation('match-finished')
              this.isMatchFinished = true
              // We save the results after the match is finished
              await this.state.saveMatchResults()
            }, 8000)
            return
          }
          // If both players are finished, we reset the round for them and start another round.
          this.finishedPlayerCount = 0
          this.state.changeStateInformation('show-results')
          // Delay for showing the results
          setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 8000)
        }
        return
      // 'button-press' action is sent when a player presses a button
      case 'button-press':
        this.state.setPlayerAnswerResults(client.id, data.button)
        return
      case 'remove-options-joker':
        let optionsToRemove

        // If we have a disabled button before hand, we send it. Otherwise we don't
        if (data.disabled === false) { optionsToRemove = this.state.removeOptionsJokerPressed() } else { optionsToRemove = this.state.removeOptionsJokerPressed(data.disabled) }

        this.send(client, {
          action: 'remove-options-joker',
          optionsToRemove: optionsToRemove
        })
        return
      case 'second-chance-joker':
        const questionAnswer = this.state.getQuestionAnswer()

        // We send the question answer to client for checking if it choose the correct option
        this.send(client, {
          action: 'second-chance-joker',
          questionAnswer: questionAnswer
        })
        return
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
        return
      // The leader presses start
      case 'start-match':
        this.isMatchStarted = true
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

        this.broadcast({
          action: 'start-match'
        })

        let logString = `Game starts with `

        const playerIdList = this.state.getPlayerIdList()

        playerIdList.forEach((playerId, index) => {
          logString += `p${index + 1}: ${this.state.getPlayerProps()[playerId].databaseId} `
        })

        logger.info(logString + `roomId: ${this.roomId}`)

        return
      // The leader can choose from different number of question amounts.
      case 'set-question-number':
        this.questionAmount = data.questionAmount
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
      const index = playerIdList.indexOf(client.id)
      playerIdList.splice(index, 1)
    }

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

  async onDispose () {
    logger.info('Room disposed')
    // Because there are no winners and losers in this game mode, it doesn't matter if we save the match results right before the room closes
    // If the match hasn't started yet, we don't save any result because there aren't any lol
    if (!this.isMatchFinished && this.isMatchStarted) {
      await this.state.saveMatchResults()
    }
  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(GroupState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(GroupRoom)

exports.groupRoom = GroupRoom