const Colyseus = require('colyseus.js')

const shellBreaker = '72b6fa48-94c0-4691-8ac9-db679a67a9b3'
const marmelade = '08f228a0-443b-4003-8b17-efe835cf6916'

let iterationCount = 1000
let joinOptions
let finishCount = 0
let joined = 0
let joinErrs = 0

for (let i = 0; i < iterationCount; i++) {
  setTimeout(() => {
    // Connect our client to game engine
    // clients[i] = new Colyseus.Client('http://35.246.252.239:5000')
    let client = new Colyseus.Client('http://localhost:5000')

    // console.log(i % 2)
    joinOptions = {
      create: true,
      examId: 1,
      courseId: 1,
      subjectId: 1,
      databaseId: i % 2 === 0 ? shellBreaker : marmelade
    }

    // Joins a room or creates one with given options
    client.joinOrCreate('rankedRoom', joinOptions).then(room => {
      console.log(++joined, 'join count')

      // Game state coming from server
      room.onStateChange(state => {
        switch (state.rankedState.stateInformation) {
          case 'question':
            // Answering the question 2 seconds later
            setTimeout(() => {
              answerQuestion(room)
            }, Math.floor(Math.random() * 3000) + 1)
            break
          case 'match-finished':
            console.log(++finishCount, 'finish count')
            room.leave()
            break
        }
      })

      room.onMessage(message => {
        if (message.action === 'game-init') {
          // We send the server a 'ready' signal to let it know client is ready
          setTimeout(() => {
            room.send({
              action: 'ready'
            })
          }, 1000)
        }
      })

      room.onError(error => {
        console.error(error)
      })
    }).catch(error => {
      joinErrs++
      console.log('Error while joining room: ', error)
    })
  }, Math.floor(Math.random() * 30000) + 1000)
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

process.on('exit', function () {
  console.log('Total number of joined players: ', joined)
  console.log('Total number of finished players: ', finishCount)
  console.log('Total number of join errors: ', joinErrs)
})

process.on('SIGINT', function () {
  console.log('Total number of joined players: ', joined)
  console.log('Total number of finished players: ', finishCount)
  console.log('Total number of join errors: ', joinErrs)
  process.exit()
})
