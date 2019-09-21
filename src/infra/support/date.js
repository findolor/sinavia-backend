const moment = require('moment')
moment.locale('tr')

module.exports = ({ config }) => {
  const currentDate = moment().tz(config.timezone)

  const addHour = (duration) => currentDate.add(duration, 'hours')

  return {
    addHour,
    moment
  }
}
