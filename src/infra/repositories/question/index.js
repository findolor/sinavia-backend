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
      .then(({ dataValues }) => toEntity(dataValues))
      .catch((error) => { throw new Error(error) })

  const destroy = (...args) =>
    model.destroy(...args)

  return {
    create,
    update,
    findById,
    findOne,
    destroy
  }
}
