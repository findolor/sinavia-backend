const engineInterface = require('../websocket/utils/loadInterface')

exports.getOneQuestion = async (id) => {
  try {
    const data = await engineInterface().getUseCase.getOne({ id: id })
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.getMultipleQuestion = async (idList) => {
  try {
    const data = await engineInterface().getUseCase.getMultiple({ idList: idList })
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}
