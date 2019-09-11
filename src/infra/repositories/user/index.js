const { toEntity } = require('./transform')
const { comparePassword } = require('../../encryption')

module.exports = ({ model }) => {
  const findAll = (...args) =>
    model.findAll(...args).then((entity) =>
      entity.map((data) => {
        const { dataValues } = data
        return dataValues
      })
    )

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
      .then((dataValues) => dataValues)
      .catch((error) => { throw new Error(error) })

  const validatePassword = (endcodedPassword) => (password) =>
    comparePassword(password, endcodedPassword)

  const destroy = (...args) =>
    model.destroy(...args)

  return {
    findAll,
    create,
    update,
    findById,
    findOne,
    validatePassword,
    destroy
  }
}
