exports.requestJoinOptions = function (i) {
  return {
    requestNumber: i,
    examName: 'LGS',
    courseName: 'Matematik',
    subjectName: 'Sayilar',
    databaseId: 'c4b812f2-78d5-4bc3-a46a-87a03bdf97fc'
  }
}

exports.onJoin = function () {
  console.log(this.sessionId, 'joined.')
}

exports.onMessage = function (message) {
  // console.log(this.sessionId, 'received:', message)
  if (Object.keys(message).length === 2) {
    setTimeout(() => {
      this.send({ action: 'ready' })
    }, 1000)
  }
}

exports.onLeave = function () {
  console.log(this.sessionId, 'left.')
}

exports.onError = function (err) {
  console.log(this.sessionId, '!! ERROR !!', err.message)
}

exports.onStateChange = function (state) {
  // console.log(this.sessionId, 'new state:', state)
  if (state.rankedState.stateInformation === 'question') {
    setTimeout(() => {
      this.send({
        action: 'button-press',
        button: 1
      })

      setTimeout(() => {
        this.send({
          action: 'finished'
        })
      }, 1000)
    }, 1000)
  }
}
