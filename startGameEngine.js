const container = require('src/container')
const app = container.resolve('app')

app
  .startGameEngine()
  .catch((error) => {
    app.logger.error(error.stack)
    process.exit()
  })
