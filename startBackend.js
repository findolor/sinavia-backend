const container = require('src/container')
const app = container.resolve('app')

app
  .startApi()
  .catch((error) => {
    app.logger.error(error.stack)
    process.exit()
  })
