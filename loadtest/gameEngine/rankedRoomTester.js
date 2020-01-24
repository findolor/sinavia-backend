console.time('test')
const Colyseus = require('colyseus.js')

const shellBreaker = '72b6fa48-94c0-4691-8ac9-db679a67a9b3'
const marmelade = '08f228a0-443b-4003-8b17-efe835cf6916'
const firstIdTestServer = '28b2131b-8a45-4a14-87fc-c1f596127d7d'
const secondIdTestServer = 'adc0e4c5-fdee-42e3-9ded-7fd065d98fc3'

const isServerTest = true

let iterationCount = 2000
let rooms = [iterationCount]
let clients = [iterationCount]
let joinOptions
let finishCount = 0
let joined = 0
let totalJoinedUsers = []
let totalFinishedUsers = []
let totalClientErrors = []

for (let i = 0; i < iterationCount; i++) {
  setTimeout(() => {
    // Connect our client to game engine
    clients[i] = isServerTest ? new Colyseus.Client('ws://35.246.252.239:5000') : new Colyseus.Client('ws://localhost:5000')

    joinOptions = {
      create: true,
      examId: 1,
      courseId: 1,
      subjectId: 1,
      databaseId: i % 2 === 0 ? isServerTest === true ? firstIdTestServer : shellBreaker : isServerTest === true ? secondIdTestServer : marmelade
    }
    // console.log(joinOptions.databaseId)
    clients[i].onOpen.add(() => {
      // Joins a room or creates one with given options
      rooms[i] = clients[i].join('rankedRoom', joinOptions)

      rooms[i].onJoin.add(() => {
        console.log(++joined, 'join count')
        totalJoinedUsers.push(i)
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
              console.log(++finishCount, 'finish count')
              totalFinishedUsers.push(i)
              rooms[i].leave()
              break
          }
        })
      })

      rooms[i].onMessage.add(message => {
        if (message.action === 'game-init') {
          // We send the server a 'ready' signal to let it know client is ready
          setTimeout(() => {
            try {
              rooms[i].send({
                action: 'ready'
              })
            } catch (error) {
              console.log(error)
            }
          }, 1000)
        }
      })

      rooms[i].onError.add(error => {
        console.error(error)
      })
    })

    clients[i].onError.add(error => {
      totalClientErrors.push(i)
      console.error(error)
    })
    // Users join in the given amount of time
  }, Math.floor(Math.random() * 60000) + 1000)
}

function answerQuestion (room) {
  try {
    room.send({
      action: 'button-press',
      button: joinOptions.examId === 1 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 4) + 1
    })
  } catch (error) {
    console.log(error)
  }

  setTimeout(() => {
    try {
      room.send({
        action: 'finished'
      })
    } catch (error) {
      console.log(error)
    }
  }, 2000)
}

process.on('exit', function () {
  console.log('Total number of joined players: ', totalJoinedUsers.length)
  console.log('Total number of finished players: ', totalFinishedUsers.length)
  console.log('Total number of client errors: ', totalClientErrors.length)
  console.timeEnd('test')
})

process.on('SIGINT', function () {
  console.log('Total number of joined players: ', totalJoinedUsers.length)
  console.log('Total number of finished players: ', totalFinishedUsers.length)
  console.log('Total number of client errors: ', totalClientErrors.length)
  process.exit()
})
