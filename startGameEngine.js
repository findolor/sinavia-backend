const container = require('src/container')
const engine = container.resolve('gameEngine')

engine
  .start()
  .catch((error) => {
    app.logger.error(error.stack)
    process.exit()
  })
