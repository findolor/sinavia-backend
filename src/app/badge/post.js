const { Badge } = require('src/domain/badge')

module.exports = ({ badgeRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        name: body.name,
        description: body.description,
        imageLink: body.imageLink
      })
      const badge = Badge(entity)

      return badgeRepository.create(badge)
    })
  }

  return {
    create
  }
}
