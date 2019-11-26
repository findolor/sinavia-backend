const Colyseus = require('colyseus.js')

const shellBreaker = '72b6fa48-94c0-4691-8ac9-db679a67a9b3'
const marmelade = '08f228a0-443b-4003-8b17-efe835cf6916'

let iterationCount = 1000
let rooms = [iterationCount]
let clients = [iterationCount]
let joinOptions
let finishCount = 0
let joined = 0

for (let i = 0; i < iterationCount; i++) {
  setTimeout(() => {
    // Connect our client to game engine
    clients[i] = new Colyseus.Client('http://35.246.252.239/engine')
    // clients[i] = new Colyseus.Client('http://localhost:5000')

    // console.log(i % 2)
    joinOptions = {
      create: true,
      examId: 1,
      courseId: 1,
      subjectId: 1,
      databaseId: i % 2 === 0 ? shellBreaker : marmelade
    }
    // console.log(joinOptions.databaseId)
    clients[i].onOpen.add(() => {
      // Joins a room or creates one with given options
      rooms[i] = clients[i].join('rankedRoom', joinOptions)

      rooms[i].onJoin.add(() => {
        console.log(++joined)
        // console.log(clients[i])

        // Game state coming from server
        rooms[i].onStateChange.add(state => {
          switch (state.rankedState.stateInformation) {
            case 'question':
              // Answering the question 2 seconds later
              setTimeout(() => {
                answerQuestion(rooms[i])
              }, Math.floor(Math.random() * 3000) + 1)
              break
            case 'match-finished':
              console.log(`Successfully finished match -- BOT  ===>  ${i}`)
              console.log(++finishCount)
              rooms[i].leave()
              break
          }
        })
      })

      rooms[i].onMessage.add(message => {
        if (message.action === 'game-init') {
          // We send the server a 'ready' signal to let it know client is ready
          setTimeout(() => {
            rooms[i].send({
              action: 'ready'
            })
          }, 1000)
        }
      })

      rooms[i].onError.add(error => {
        console.error(error)
      })
    })

    clients[i].onError.add(error => {
      console.error(error)
    })
  }, Math.floor(Math.random() * 180000) + 5000)
}

function answerQuestion (room) {
  room.send({
    action: 'button-press',
    button: joinOptions.examId === 1 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 4) + 1
  })

  setTimeout(() => {
    room.send({
      action: 'finished'
    })
  }, 2000)
}
