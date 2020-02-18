const { PurchaseReceipt } = require('src/domain/purchaseReceipt')

module.exports = ({ purchaseReceiptRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const purchaseReceipt = PurchaseReceipt(body)

      return purchaseReceiptRepository.create(purchaseReceipt)
    })
  }

  return {
    create
  }
}
