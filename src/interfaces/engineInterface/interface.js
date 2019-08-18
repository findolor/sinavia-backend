const log = require('src/infra/logging/logger')
const config = require('config/')
const logger = log({ config })
const engineInterface = require('../websocket/utils/loadInterface')

exports.getOneQuestion = async (id) => {
  try {
    const data = await engineInterface().getQuestionUseCase.getOne({ id: id })
    return data
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get question')
    logger.error(error.stack)
    throw error
  }
}

exports.getMultipleQuestions = async (idList, matchInformation) => {
  try {
    const data = await engineInterface().getQuestionUseCase.getMultiple({ idList: idList, matchInformation: matchInformation })
    return data
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get questions')
    logger.error(error.stack)
    throw error
  }
}

exports.postStatistic = async (gameResults) => {
  try {
    const data = await engineInterface().postStatisticUseCase.createStat({ gameResults: gameResults })
    return data
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot post statistics')
    logger.error(error.stack)
    throw error
  }
}

exports.getMultipleUsers = async (idList) => {
  try {
    const data = await engineInterface().getUserUseCase.getMultiple({ idList: idList })
    return data
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get users')
    logger.error(error.stack)
    throw error
  }
}

exports.getOneUser = async (id) => {
  try {
    const data = await engineInterface().getUserUseCase.getOne({ id: id })
    return data
  } catch (error) {
    logger.error('GAME ENGINE INTERFACE => Cannot get user')
    logger.error(error.stack)
    throw error
  }
}
