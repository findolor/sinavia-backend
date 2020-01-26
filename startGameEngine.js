const container = require('src/container')
const app = container.resolve('app')

app
  .startEngine()
  .catch((error) => {
    app.logger.error(error.stack)
    process.exit()
  })
