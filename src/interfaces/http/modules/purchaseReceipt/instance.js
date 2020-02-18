const container = require('src/container') // we have to get the DI
const { getPurchaseReceipt, postPurchaseReceipt } = require('src/app/purchaseReceipt')

module.exports = () => {
  const {
    repository: { purchaseReceiptRepository }
  } = container.cradle

  const getPurchaseReceiptUseCase = getPurchaseReceipt({ purchaseReceiptRepository })
  const postPurchaseReceiptUseCase = postPurchaseReceipt({ purchaseReceiptRepository })

  return {
    getPurchaseReceiptUseCase,
    postPurchaseReceiptUseCase
  }
}
