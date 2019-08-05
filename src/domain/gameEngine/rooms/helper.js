// Takes players from the rooms and calculates their results and returns it.
// Can be used for 1 and more players
const calculateResults = (playerList) => {
  // Results are returned in this list
  const resultList = []

  let playerCorrect = 0
  let playerIncorrect = 0
  let playerUnanswered = 0

  // We iterate through players
  playerList.forEach(player => {
    // We iterate through answers
    player.answers.forEach(answer => {
      switch (answer.result) {
        case null:
          playerUnanswered++
          return
        case true:
          playerCorrect++
          return
        case false:
          playerIncorrect++
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
  })

  return resultList
}

module.exports = {
  calculateResults
}
