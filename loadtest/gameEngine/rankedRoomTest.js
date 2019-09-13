const Colyseus = require('colyseus.js')

// Connect our client to game engine
const client = new Colyseus.Client('http://localhost:5000')

const joinOptions = {
  create: true,
  examId: 1,
  courseId: 1,
  subjectId: 1,
  // kullanici1 users table id
  databaseId: parseInt(process.argv[2], 10) === 0 ? '4973ef67-cc68-4702-8082-f9ea6b69a463' : 'c4b812f2-78d5-4bc3-a46a-87a03bdf97fc'
}

client.onOpen.add(() => {
  // Joins a room or creates one with given options
  const room = client.join('rankedRoom', joinOptions)
  console.log(`Successfully joined room: ${room}`)

  // We send the server a 'ready' signal to let it know client is ready
  setTimeout(() => {
    room.send({
      action: 'ready'
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
        console.log(`Player Two answers: ${rankedState.playerProps[rankedState.playerTwoId].answers}`)
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
    button: 1
  })

  setTimeout(() => {
    room.send({
      action: 'finished'
    })
  }, 1000)
}
