const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  getMultipleQuestions
} = require('../../../interfaces/engineInterface/interface')

class RankedState {
  constructor (
    playerOneUsername,
    playerTwoUsername,
    playerOneId,
    playerTwoId,
    questionProps,
    questionList,
    playerOneAnswers,
    playerTwoAnswers,
    questionNumber,
    matchInformation,
    stateInformation
    // TODO Think if you will add more attributes
  ) {
    this.playerOneUsername = playerOneUsername
    this.playerTwoUsername = playerTwoUsername
    this.playerOneId = playerOneId
    this.playerTwoId = playerTwoId
    this.questionProps = questionProps
    this.questionList = questionList
    this.playerOneAnswers = playerOneAnswers
    this.playerTwoAnswers = playerTwoAnswers
    this.questionNumber = questionNumber
    this.matchInformation = matchInformation
    this.stateInformation = stateInformation
  }
}

class RankedGame {
  constructor () {
    this.rankedState = new RankedState(
      '', // p1 username
      '', // p2 username
      '', // p1 id
      '', // p2 id
      [], // question props
      [], // question list
      [], // player answers
      [], // player answers
      -1, // current question number
      {}, // match information (level, exam, course, subject, )
      ''
    )
  }

  // Adds the player to our room state
  addPlayer (clientId, username) {
    if (this.rankedState.playerOneId === '') {
      this.rankedState.playerOneId = clientId
      this.rankedState.playerOneUsername = username
    } else {
      this.rankedState.playerTwoId = clientId
      this.rankedState.playerTwoUsername = username
    }
  }

  // Sets the players answers then sends a response to our client
  setPlayerAnswerResults (clientId, button) {
    if (clientId === this.rankedState.playerOneId) {
      this.rankedState.playerOneAnswers[this.rankedState.questionNumber] = {
        answer: button,
        result: this.checkAnswer(button)
      }
      // result-one means that playerOne answered the question
      this.rankedState.stateInformation = 'results-one'
    } else {
      this.rankedState.playerTwoAnswers[this.rankedState.questionNumber] = {
        answer: button,
        result: this.checkAnswer(button)
      }
      // result-one means that playerTwo answered the question
      this.rankedState.stateInformation = 'results-two'
    }
  }

  // Checks the players answer and returns the proper response
  checkAnswer (playerAnswer) {
    const questionProps = this.rankedState.questionProps[this.rankedState.questionNumber]

    switch (playerAnswer) {
      // Question unanswered
      case 6:
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

  getQuestionNumber () {
    return this.rankedState.questionNumber
  }
}

// Gets random numbers for given range and lenght
function getRandomUniqueNumbers (uniqueItemNumber, topNumber) {
  let arr = []
  while (arr.length < uniqueItemNumber) {
    let r = Math.floor(Math.random() * topNumber) + 1
    if (arr.indexOf(r) === -1) arr.push(r)
  }
  return arr
}

// Gets questions by providing it with random indexes
async function getQuestions (matchInformation, questionIdList) {
  try {
    const questions = await getMultipleQuestions(questionIdList, matchInformation)
    return questions
  } catch (error) { // TODO will remove these console.logs don't worry lol
    console.log(error, 'error')
  }
}

class RankedRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 2
    this.readyPlayerCount = 0
    this.finishedPlayerCount = 0
    this.questionIdList = []
    this.questionAmount = 0
  }

  onInit (options) {
    // We get a random list of numbers for our question fetching
    const questionAmount = 3
    this.questionIdList = getRandomUniqueNumbers(questionAmount, 5)
    this.questionAmount = questionAmount

    // We initialize our game here
    this.setState(new RankedGame())
  }

  // If this room is full new users will join another room
  requestJoin (options, isNew) {
    if (isNew) {
      return ((options.create && isNew) || this.clients.length > 0)
    } else {
      const matchInformation = this.state.getMatchInformation()
      const ROOM_AVAILABILITY_CHECK = (options.create && isNew) || this.clients.length > 0
      const EXAM_COURSE_SUBJECT_CHECK = (matchInformation.examName === options.examName) &&
                                        (matchInformation.courseName === options.courseName) &&
                                        (matchInformation.subjectName === options.subjectName)
      const LEVEL_CHECK = matchInformation.matchLevel === options.userLevel
      if (ROOM_AVAILABILITY_CHECK) { // First we check if the room is available for joining
        if (EXAM_COURSE_SUBJECT_CHECK) { // Then we check if this is the same game with both players
          if (LEVEL_CHECK) { // Then we check the user level
            return true // User can join the game
          } else { return false } // Failed level check
        } else { return false } // Failed exam/course/subject check
      } else { return false } // Failed room availability check
    }
  }

  async onJoin (client, options) {
    logger.info({
      clientId: client.id,
      clientNumber: this.clients.length
    })

    // We don't do these steps again for a second player. Only for once
    if (this.clients.length !== 2) {
      const matchInformation = {
        matchLevel: options.userLevel,
        examName: options.examName,
        courseName: options.courseName,
        subjectName: options.subjectName
      }

      // Fetching questions from database
      const questionProps = await getQuestions(matchInformation, this.questionIdList)
      const questionList = []

      // Getting only the question links
      questionProps.forEach(element => {
        questionList.push(element.questionLink)
      })

      // Setting general match related info
      this.state.setQuestions(questionProps, questionList)
      this.state.setMatchInformation(matchInformation)
    }

    // Finally adding the player to our room state
    this.state.addPlayer(client.id, options.username)
    if (this.clients.length === this.maxClients) {
      // If we have reached the maxClients, we lock the room for unexpected things
      this.lock()
    }
  }

  onMessage (client, data) {
    const that = this
    switch (data.action) {
      // Players send 'ready' action to server for letting it know that they are ready for the game
      case 'ready':
        if (++this.readyPlayerCount === 2) {
          // When players get the 'question' action they start the round and play.
          // This delay will be longer due to pre-match player showcases.
          setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 2000)
        }
        return
      // 'finished' action is sent after a player answers a question.
      case 'finished':
        if (++this.finishedPlayerCount === 2) {
          // We check if this is the last question
          // We extract one because questionNumber started from -1
          if (this.state.getQuestionNumber() === this.questionAmount - 1) {
            this.state.changeStateInformation('match-finished')
            return
          }
          // If both players are finished, we reset the round for them and start another round.
          this.finishedPlayerCount = 0
          this.state.changeStateInformation('reset-round')
          setTimeout(() => {
            that.state.nextQuestion()
            that.state.changeStateInformation('question')
          }, 5000)
        }
        return
      // 'button-press' action is sent when a player presses a button
      case 'button-press':
        this.state.setPlayerAnswerResults(client.id, data.button)
    }
  }
  onLeave (client, consented) {
    logger.info({
      message: 'Client leaving',
      clientId: client.id,
      consented: consented
    })
    // TODO Implement a gracefull shutdown mechanic for user leaving the match
  }
  onDispose () {
    logger.info('Room disposed')
    // TODO We need to send the results to our database here before the room is disposed
  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(RankedState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(RankedRoom)

exports.randkedRoom = RankedRoom
