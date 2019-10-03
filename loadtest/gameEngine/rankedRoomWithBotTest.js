const Colyseus = require('colyseus.js')

// Connect our client to game engine
const client = new Colyseus.Client('http://localhost:5000')

const playerOneId = 'c4b812f2-78d5-4bc3-a46a-87a03bdf97fc'

const joinOptions = {
  create: true,
  examId: 1,
  courseId: 1,
  subjectId: 1,
  // kullanici1 users table id
  databaseId: playerOneId
}

client.onOpen.add(() => {
  // Joins a room or creates one with given options
  const room = client.join('rankedRoom', joinOptions)
  console.log(`Successfully joined room: ${room}`)
  console.log(`Player id: ${playerOneId}`)

  // We send the server a 'ready' signal to let it know client is ready
  setTimeout(() => {
    room.send({
      action: 'start-with-bot'
    })
  }, 1500)

  // Game state coming from server
  room.onStateChange.add(state => {
    const rankedState = state.rankedState
    switch (state.rankedState.stateInformation) {
      case 'question':
        // Answering the question 2 seconds later
        setTimeout(() => {
          answerQuestion(room)
        }, 1500)
        break
      case 'match-finished':
        console.log(`Player One answers: ${rankedState.playerProps[rankedState.playerOneId].answers}`)
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
