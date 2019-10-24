const { GameEnergy } = require('src/domain/gameEnergy')

module.exports = ({ gameEnergyRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const gameEnergy = GameEnergy(body)

      return gameEnergyRepository.create(gameEnergy)
    })
  }

  return {
    create
  }
}
