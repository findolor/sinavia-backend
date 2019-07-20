const instance = require('./instance')

module.exports = () => {
  const app = instance()

  return app
}
