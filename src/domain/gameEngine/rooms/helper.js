// Takes players from the rooms and calculates their results and returns it.
// Can be used for 1 and more players
const calculateResults = (playerList) => {
  // Results are returned in this list
  const resultList = []
  const wrongSolvedIndex = []

  let playerCorrect = 0
  let playerIncorrect = 0
  let playerUnanswered = 0

  // We iterate through players
  playerList.forEach(player => {
    let tempList = []
    // We iterate through answers
    player.answers.forEach((answer, index) => {
      // If the user doesn't have any answers we just give him 0 answers
      if (Object.keys(answer).length === 0) {
        resultList.push({
          correct: 0,
          incorrect: 0,
          unanswered: 0
        })
        return
      }
      switch (answer.result) {
        case null:
          playerUnanswered++
          break
        case true:
          playerCorrect++
          break
        case false:
          playerIncorrect++
          tempList.push(index)
          break
      }
    })
    // We push the results to the result list
    resultList.push({
      correct: playerCorrect,
      incorrect: playerIncorrect,
      unanswered: playerUnanswered
    })
    playerCorrect = 0
    playerIncorrect = 0
    playerUnanswered = 0
    // We push wrongs
    wrongSolvedIndex.push(tempList)
  })

  return {
    resultList: resultList,
    wrongSolvedIndex: wrongSolvedIndex
  }
}

const calculateResultsSolo = (player) => {
  // Results are returned in this list
  const resultList = []
  const wrongSolvedIndex = []

  let playerCorrect = 0
  let playerIncorrect = 0
  let playerUnanswered = 0

  // We iterate through answers
  player.answers.forEach((answer, index) => {
    // If the user doesn't have any answers we just give him 0 answers
    if (Object.keys(answer).length === 0) {
      resultList.push({
        correct: 0,
        incorrect: 0,
        unanswered: 0
      })
      return
    }
    switch (answer.result) {
      case null:
        playerUnanswered++
        break
      case true:
        playerCorrect++
        break
      case false:
        playerIncorrect++
        wrongSolvedIndex.push(index)
        break
    }
  })
  // We push the results to the result list
  resultList.push({
    correct: playerCorrect,
    incorrect: playerIncorrect,
    unanswered: playerUnanswered
  })
  playerCorrect = 0
  playerIncorrect = 0
  playerUnanswered = 0

  return {
    resultList: resultList,
    wrongSolvedIndex: wrongSolvedIndex
  }
}

module.exports = {
  calculateResults,
  calculateResultsSolo
}
