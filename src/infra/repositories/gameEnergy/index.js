const { toEntity } = require('./transform')

module.exports = ({ model }) => {
  const create = (...args) =>
    model.create(...args).then(({ dataValues }) => toEntity(dataValues))

  const update = (...args) =>
    model.update(...args)
      .catch((error) => { throw new Error(error) })

  const findById = (...args) =>
    model.findByPk(...args)
      .then(({ dataValues }) => toEntity(dataValues))
      .catch((error) => { throw new Error(error) })

  const findOne = (...args) =>
    model.findOne(...args)
      .then(({ dataValues }) => dataValues)
      .catch((error) => { throw new Error(error) })

  const findAll = (...args) =>
    model.findAll(...args).then((entity) =>
      entity.map((data) => {
        const { dataValues } = data
        return toEntity(dataValues)
      })
    )

  const destroy = (...args) =>
    model.destroy(...args)

  return {
    create,
    update,
    findById,
    findOne,
    destroy,
    findAll
  }
}
