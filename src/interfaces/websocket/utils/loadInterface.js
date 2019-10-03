const path = require('path')

module.exports = function loadInterface () {
  const interfacePath = path.resolve('src/interfaces/databaseInterface/')
  const Interface = require(interfacePath)

  return Interface()
}
