module.exports = ({ purchaseReceiptRepository }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        return purchaseReceiptRepository.findAll({
          where: {
            userId: userId
          }
        })
      })
  }

  return {
    getBatch
  }
}
