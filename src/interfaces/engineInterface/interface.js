const engineInterface = require('../websocket/utils/loadInterface')

exports.getOneQuestion = async (id) => {
  try {
    const data = await engineInterface().getUseCase.getOne({ id: id })
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.getMultipleQuestions = async (idList, matchInformation) => {
  try {
    const data = await engineInterface().getUseCase.getMultiple({ idList: idList, matchInformation: matchInformation })
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}
