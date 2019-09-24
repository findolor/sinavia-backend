const Colyseus = require('colyseus.js')

// Connect our client to game engine
const client = new Colyseus.Client('http://localhost:5000')

const playerZeroId = '4973ef67-cc68-4702-8082-f9ea6b69a463'
const playerOneId = 'c4b812f2-78d5-4bc3-a46a-87a03bdf97fc'

const selectedPlayer = parseInt(process.argv[2], 10)

const joinOptions = {
  create: selectedPlayer === 0,
  examId: 1,
  courseId: 1,
  subjectId: 1,
  roomCode: 'CODE',
  // kullanici1 users table id
  databaseId: selectedPlayer === 0 ? playerZeroId : playerOneId
}

client.onOpen.add(() => {
  // Joins a room or creates one with given options
  const room = client.join('friendRoom', joinOptions)
  console.log(`Successfully joined room: ${room}`)
  console.log(`Player id: ${selectedPlayer === 0 ? playerZeroId : playerOneId}`)

  // We send the server a 'ready' signal to let it know client is ready
  setTimeout(() => {
    room.send({
      action: 'ready'
    })
  }, 1500)

  // Game state coming from server
  room.onStateChange.add(state => {
    const friendState = state.friendState
    switch (state.friendState.stateInformation) {
      case 'question':
        // Answering the question 2 seconds later
        setTimeout(() => {
          answerQuestion(room)
        }, 1500)
        break
      case 'match-finished':
        console.log(`Player One answers: ${friendState.playerProps[friendState.playerOneId].answers}`)
        console.log(`Player Two answers: ${friendState.playerProps[friendState.playerTwoId].answers}`)
        process.exit()
    }
  })

  // Messages coming from server
  room.onMessage.add(message => {
  })
})

function answerQuestion (room) {
  room.send({
    action: 'button-press',
    button: joinOptions.examId === 1 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 4) + 1
  })

  setTimeout(() => {
    room.send({
      action: 'finished'
    })
  }, 1000)
}
