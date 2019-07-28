const colyseus = require('colyseus')
const log = require('../../../infra/logging/logger')
const config = require('../../../../config')
const logger = log({ config })
const {
  getMultipleQuestions,
  postStatistic,
  getOneUser
} = require('../../../interfaces/engineInterface/interface')

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
      {}, // match information (level, exam, course, subject, )
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
      profilePicture: userInformation.profilePicture
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

  getQuestionAnswer () {
    return this.rankedState.questionProps[this.rankedState.questionNumber].correctAnswer
  }

  getPlayerProps () {
    return this.rankedState.playerProps
  }

  getPlayerId (playerNumber) {
    switch(playerNumber) {
      case 1:
        return this.rankedState.playerOneId
      case 2:
        return this.rankedState.playerTwoId
    }
  }

  // Calculates the number of different answers and returns it
  getTotalResults() {
    let playerOneCorrect = 0
    let playerTwoCorrect = 0
    let playerOneIncorrect = 0
    let playerTwoIncorrect = 0
    let playerOneUnanswered = 0
    let playerTwoUnanswered = 0

    const playerOneAnswers = this.rankedState.playerProps[this.rankedState.playerOneId].answers
    const playerTwoAnswers = this.rankedState.playerProps[this.rankedState.playerTwoId].answers

    playerOneAnswers.forEach(element => {
      switch(element.result) {
        case null:
          playerOneUnanswered++
          return
        case true:
          playerOneCorrect++
          return
        case false:
          playerOneIncorrect++
          return
      }
    })

    playerTwoAnswers.forEach(element => {
      switch(element.result) {
        case null:
          playerTwoUnanswered++
          return
        case true:
          playerTwoCorrect++
          return
        case false:
          playerTwoIncorrect++
          return
      }
    })

    const results = {
      playerOne: {
        correct: playerOneCorrect,
        incorrect: playerOneIncorrect,
        unanswered: playerOneUnanswered
      },
      playerTwo: {
        correct: playerTwoCorrect,
        incorrect: playerTwoIncorrect,
        unanswered: playerTwoUnanswered
      }
    }

    return results
  }

  removeOptionsJokerPressed (alreadyDisabled) {
    let disabledButton
    // We check if the user has a disabled button. We don't include it if we have one
    alreadyDisabled === undefined ? disabledButton = true : disabledButton = alreadyDisabled

    const examName = this.rankedState.matchInformation.examName
    const questionAnswer = this.getQuestionAnswer()

    const optionsToRemove = []

    let randomNumber
    let loop = 0
    let firstRandomOption = -1

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
      // Same logic but for 4 options
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

  async saveMatchResults() {
    const matchInformation = this.getMatchInformation()
    const playerProps = this.getPlayerProps()

    const results = this.getTotalResults()

    // Statistic information for player one
    const gameResultPlayerOne = {
      examName: matchInformation.examName,
      subjectName: matchInformation.subjectName,
      courseName: matchInformation.courseName,
      correctNumber: results.playerOne.correct,
      incorrectNumber: results.playerOne.incorrect,
      unansweredNumber: results.playerOne.unanswered,
      timestamp: new Date().toISOString(),
      userId: playerProps[this.getPlayerId(1)].databaseId
    }

    // Statistic information for player two
    const gameResultPlayerTwo = {
      examName: matchInformation.examName,
      subjectName: matchInformation.subjectName,
      courseName: matchInformation.courseName,
      correctNumber: results.playerTwo.correct,
      incorrectNumber: results.playerTwo.incorrect,
      unansweredNumber: results.playerTwo.unanswered,
      timestamp: new Date().toISOString(),
      userId: playerProps[this.getPlayerId(2)].databaseId
    }
    
    await postMatchResults(gameResultPlayerOne, gameResultPlayerTwo)
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
    const questions = await getMultipleQuestions(
      questionIdList,
      matchInformation
    )
    return questions
  } catch (error) {
    // TODO will remove these console.logs don't worry lol
    console.log(error, 'error')
  }
}

// Gets the user information
async function getUser (id) {
  try {
    const user = await getOneUser(id)
    return user
  } catch(error) {
    // TODO will remove these console.logs don't worry lol
    console.log(error, 'error')
  }
}

// Saves the results to the database
async function postMatchResults (gameResultPlayerOne, gameResultPlayerTwo) {
    try {
      // For player one
      const dataOne = await postStatistic(gameResultPlayerOne)
      console.log(dataOne)

      // For player two
      const dataTwo = await postStatistic(gameResultPlayerTwo)
      console.log(dataTwo)
    } catch(error) {
      // TODO will remove these console.logs don't worry lol
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
    this.isMatchFinished = false
  }

  onInit (options) {
    // We get a random list of numbers for our question fetching
    const questionAmount = 5
    this.questionIdList = getRandomUniqueNumbers(questionAmount, 5)
    this.questionAmount = questionAmount

    // We initialize our game here
    this.setState(new RankedGame())
  }

  // If this room is full new users will join another room
  requestJoin (options, isNew) {
    if (isNew) {
      return (options.create && isNew) || this.clients.length > 0
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
    // We don't do these steps again for a second player. Only for once
    if (this.clients.length !== 2) {
      const matchInformation = {
        matchLevel: options.userLevel,
        examName: options.examName,
        courseName: options.courseName,
        subjectName: options.subjectName
      }

      // Fetching questions from database
      const questionProps = await getQuestions(
        matchInformation,
        this.questionIdList
      )
      const questionList = []

      // Getting only the question links
      questionProps.forEach(element => {
        questionList.push(element.questionLink)
      })
      // Setting general match related info
      this.state.setQuestions(questionProps, questionList)
      this.state.setMatchInformation(matchInformation)
    }

    // Getting user information from database
    const userInformation = await getUser(options.databaseId)

    // Finally adding the player to our room state
    this.state.addPlayer(client.id, userInformation, options.databaseId)

    console.log(this.state.getPlayerProps())

    if (this.clients.length === this.maxClients) {
      // If we have reached the maxClients, we lock the room for unexpected things
      this.lock()
      // We send the clients player information
      this.broadcast(this.state.getPlayerProps())
    }
  }

  // TODO Move the actions into their own functions
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
          }, 3000)
        }
        return
      // 'finished' action is sent after a player answers a question.
      case 'finished':
        if (++this.finishedPlayerCount === 2) {
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
    }
  }
  onLeave (client, consented) {
    logger.info({
      message: 'Client leaving',
      clientId: client.id,
      consented: consented
    })

    if(this.clients.length !== 0) {
      const lastClient = this.clients[0]

      this.send(lastClient, {
        action: 'client-leaving'
      })
    }
  }
  async onDispose () {
    logger.info('Room disposed')
    
    if(!this.isMatchFinished) {
      await this.state.saveMatchResults()
    }
    
  }
}

// We are not syncing questionProps to clients. This array contains question answers
colyseus.nosync(RankedState.prototype, 'questionProps')

colyseus.serialize(colyseus.FossilDeltaSerializer)(RankedRoom)

exports.randkedRoom = RankedRoom
