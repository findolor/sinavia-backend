const container = require('src/container') // we have to get the DI
const { getGameEnergy } = require('src/app/gameEnergy')

module.exports = () => {
  const {
    repository: { gameEnergyRepository }
  } = container.cradle

  const getGameEnergyUseCase = getGameEnergy({ gameEnergyRepository })

  return {
    getGameEnergyUseCase
  }
}
