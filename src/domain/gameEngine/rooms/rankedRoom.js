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
    playerOneButton,
    playerTwoButton,
    questionProps,
    playerOneAnswers,
    playerTwoAnswers,
    questionNumber,
    matchInformation
    // TODO Think if you will add more attributes
  ) {
    this.playerOneUsername = playerOneUsername
    this.playerTwoUsername = playerTwoUsername
    this.playerOneId = playerOneId
    this.playerTwoId = playerTwoId
    this.playerOneButton = playerOneButton
    this.playerTwoButton = playerTwoButton
    this.questionProps = questionProps
    this.playerOneAnswers = playerOneAnswers
    this.playerTwoAnswers = playerTwoAnswers
    this.questionNumber = questionNumber
    this.matchInformation = matchInformation
  }
}

class RankedGame {
  constructor (questionProps) {
    this.rankedState = new RankedState(
      '', // p1 username
      '', // p2 username
      '', // p1 id
      '', // p2 id
      0, // p1 button
      0, // p2 button
      questionProps, // question props
      [], // player answers
      [], // player answers
      -1, // current question number
      {} // match information (level, exam, course, subject, )
    )
  }

  addPlayer (clientId, username) {
    if (this.rankedState.playerOneId === '') {
      this.rankedState.playerOneId = clientId
      this.rankedState.playerOneUsername = username
    } else {
      this.rankedState.playerTwoId = clientId
      this.rankedState.playerTwoUsername = username
    }
  }

  setPlayerButton (clientId, button) {
    if (clientId === this.rankedState.playerOneId) {
      this.rankedState.playerOneButton = button
      this.rankedState.playerOneAnswers[this.rankedState.questionNumber] = button
    } else {
      this.rankedState.playerTwoButton = button
      this.rankedState.playerTwoAnswers[this.rankedState.questionNumber] = button
    }
  }

  resetButtons () {
    this.rankedState.playerOneButton = 0
    this.rankedState.playerTwoButton = 0
  }

  nextQuestion () {
    this.rankedState.questionNumber++
  }

  setMatchInformation (
    matchLevel,
    examName,
    courseName,
    subjectName
  ) {
    this.rankedState.matchInformation.matchLevel = matchLevel
    this.rankedState.matchInformation.examName = examName
    this.rankedState.matchInformation.courseName = courseName
    this.rankedState.matchInformation.subjectName = subjectName
  }

  getMatchInformation () {
    return this.rankedState.matchInformation
  }
}

function getRandomUniqueNumbers (uniqueItemNumber, topNumber) {
  let arr = []
  while (arr.length < uniqueItemNumber) {
    let r = Math.floor(Math.random() * topNumber) + 1
    if (arr.indexOf(r) === -1) arr.push(r)
  }
  return arr
}

class RankedRoom extends colyseus.Room {
  constructor () {
    super()
    this.maxClients = 2
    this.readyPlayerCount = 0
    this.finishedPlayerCount = 0
  }

  async onInit (options) {
    this.setState(new RankedGame())

    const idList = getRandomUniqueNumbers(5, 5)

    try {
      const questions = await getMultipleQuestions(idList)
      console.log(questions, 'questions')
    } catch (error) { // TODO will remove these console.logs don't worry lol
      console.log(error, 'error')
    }
  }

  // If this room is full new users will join another room
  requestJoin (options, isNew) {
    if (isNew) {
      // We set the match information when the first user joins. --> Creator
      this.state.setMatchInformation(
        options.userLevel,
        options.examName,
        options.courseName,
        options.subjectName
      )
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

  onJoin (client, options) {
    logger.info({
      clientId: client.id,
      clientNumber: this.clients.length
    })
    this.state.addPlayer(client.id, options.username)
  }
  onMessage (client, data) {
    const that = this
    logger.info(data)
    switch (data.action) {
      case 'ready':
        if (++this.readyPlayerCount === 2) {
          this.state.nextQuestion() // When the server updates questionNumber, clients will know to start the question
        }
        return
      case 'finished':
        if (++this.finishedPlayerCount === 2) {
          this.finishedPlayerCount = 0
          setTimeout(() => {
            that.state.resetButtons()
            that.state.nextQuestion()
          }, 5000)
        }
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

colyseus.serialize(colyseus.FossilDeltaSerializer)(RankedRoom)

exports.randkedRoom = RankedRoom
