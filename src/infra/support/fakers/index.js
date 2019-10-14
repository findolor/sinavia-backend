const path = require('path')

require('dotenv-flow').config()

module.exports = function createFixtureRoutes (fixtureURI) {
  const basePath = process.env.NODE_ENV || 'development'
  const fixturePath = path.resolve(`src/infra/support/fakers/${basePath}`, fixtureURI)

  const Fixture = require(fixturePath)
  return Fixture()
}
