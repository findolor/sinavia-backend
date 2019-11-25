const rankedRoom = require('./rankedRoom').rankedRoom
const groupRoom = require('./groupRoom').groupRoom
const friendRoom = require('./friendRoom').friendRoom
const friendSoloRoom = require('./friendSoloRoom').friendSoloRoom
const soloModeRoom = require('./soloModeRoom').soloModeRoom
const unsolvedQuestionsRoom = require('./unsolvedQuestionsRoom').unsolvedQuestionsRoom

module.exports = {
  rankedRoom,
  groupRoom,
  friendRoom,
  friendSoloRoom,
  soloModeRoom,
  unsolvedQuestionsRoom
}
