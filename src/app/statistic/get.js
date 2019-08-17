module.exports = ({ statisticRepository }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const statistics = statisticRepository.findAll({
          where: {
            userId: userId
          }
        })
        return statistics
      })
      .catch(error => {
        console.log(error)
        throw new Error(error)
      })
  }

  return {
    getBatch
  }
}
