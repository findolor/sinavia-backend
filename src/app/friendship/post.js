const { Friendship } = require('src/domain/friendship')

module.exports = ({ friendshipRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, body)
      const friendship = Friendship(entity)

      return friendshipRepository.create(friendship)
    })
  }

  return {
    create
  }
}
