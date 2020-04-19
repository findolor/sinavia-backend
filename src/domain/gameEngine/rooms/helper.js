const fs = require('fs')

// Takes players from the rooms and calculates their results and returns it.
// Can be used for 1 and more players
const calculateResults = (playerList) => {
  // Results are returned in this list
  const resultList = []
  const unsolvedIndex = []

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
    unsolvedIndex.push(tempList)
  })

  return {
    resultList: resultList,
    unsolvedIndex: unsolvedIndex
  }
}

const calculateResultsSolo = (player) => {
  // Results are returned in this list
  const resultList = []
  // This is for the questions that are incorrectly answered
  const unsolvedIndex = []
  // This is for the questions that are correctly answered
  const solvedIndex = []

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
        solvedIndex.push(index)
        break
      case false:
        playerIncorrect++
        unsolvedIndex.push(index)
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
    unsolvedIndex: unsolvedIndex,
    solvedIndex: solvedIndex
  }
}

const getBotInformation = async () => {
  return new Promise((resolve, reject) => {
    let nameList
    let lastnameList
    let cityList

    fs.readFile('./src/domain/gameEngine/botFiles/names.txt', 'utf-8', (err, data) => {
      if (err) reject(err)
      nameList = data.split('\n')

      fs.readFile('./src/domain/gameEngine/botFiles/lastnames.txt', 'utf-8', (err, data) => {
        if (err) reject(err)
        lastnameList = data.split('\n')

        fs.readFile('./src/domain/gameEngine/botFiles/cities.txt', 'utf-8', (err, data) => {
          if (err) reject(err)
          cityList = data.split('\n')

          nameList.pop()
          lastnameList.pop()
          cityList.pop()

          const nameRand = Math.floor(Math.random() * nameList.length)
          const lastnameRand = Math.floor(Math.random() * lastnameList.length)
          const cityRand = Math.floor(Math.random() * cityList.length)

          resolve({
            username: nameList[nameRand] + lastnameList[lastnameRand],
            city: cityList[cityRand]
          })
        })
      })
    })
  })
}

module.exports = {
  calculateResults,
  calculateResultsSolo,
  getBotInformation
}
