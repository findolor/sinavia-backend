const { assoc } = require('ramda')
const moment = require('./date')

module.exports = ({ config }) => {
  const momentVar = moment({ config })
  const defaultResponse = (success = true) => {
    return {
      success,
      version: config.version,
      date: momentVar.moment().utc(true).toDate()
    }
  }

  const Success = (data) => {
    return assoc(
      'data',
      data,
      defaultResponse(true)
    )
  }

  const Fail = (data) => {
    return assoc(
      'error',
      data,
      defaultResponse(false)
    )
  }

  return {
    Success,
    Fail
  }
}
