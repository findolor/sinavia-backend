const engineInterface = require('../websocket/utils/loadInterface')

exports.getOneQuestion = async (id) => {
  try {
    const data = await engineInterface().getQuestionUseCase.getOne({ id: id })
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.getMultipleQuestions = async (idList, matchInformation) => {
  try {
    const data = await engineInterface().getQuestionUseCase.getMultiple({ idList: idList, matchInformation: matchInformation })
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.postStatistic = async (gameResults) => {
  try {
    const data = await engineInterface().postStatisticUseCase.createStat({gameResults: gameResults})
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}
