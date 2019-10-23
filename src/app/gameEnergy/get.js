module.exports = ({ gameEnergyRepository }) => {
  const getOne = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const gameEnergyEntity = gameEnergyRepository.findOne({
          where: {
            userId: userId
          }
        })
        return gameEnergyEntity
      })
  }

  return {
    getOne
  }
}
