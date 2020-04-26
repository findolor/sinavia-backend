module.exports = ({ priceRepository }) => {
  const getBatch = () => {
    return Promise
      .resolve()
      .then(() => {
        return priceRepository.findAll()
      })
  }

  return {
    getBatch
  }
}
