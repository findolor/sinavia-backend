const container = require('src/container')
const router = require('./router')

module.exports = () => {
  const { response: { Success, Fail } } = container.cradle

  return {
    router: router({ response: { Success, Fail } })
  }
}
