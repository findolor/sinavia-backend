const container = require('src/container') // we have to get the DI
const { getPrices } = require('src/app/price')

module.exports = () => {
  const {
    repository: { priceRepository }
  } = container.cradle

  const getPricesUseCase = getPrices({ priceRepository })

  return {
    getPricesUseCase
  }
}
