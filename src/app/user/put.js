const { User } = require('src/domain/user')
const { encryptPassword } = require('../../infra/encryption')

module.exports = ({ userRepository }) => {
  // code for getting all the items
  const updateUser = ({ id, body }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Encrypting the password before updating
        // We do this if we have a password
        if (body.password) body.password = encryptPassword(body.password)

        if (body.premiumEndDate && body.premiumEndDate !== null) body.premiumEndDate = new Date(body.premiumEndDate)

        const user = User(body)
        if (body.premiumEndDate && body.premiumEndDate === null) user.premiumEndDate = null

        await userRepository.update(user, {
          where: { id }
        })

        resolve(user)
      } catch (error) {
        reject(error)
      }
    })
  }

  const addPremiumTime = ({ id, body }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await userRepository.findOne({
          where: {
            id: id
          },
          attributes: { exclude: ['password'] }
        })
        const { dataValues } = user
        user = dataValues

        if (user.isPremium) {
          const premiumDate = new Date(user.premiumEndDate)
          const newDate = new Date(premiumDate.setMonth(premiumDate.getMonth() + body.premiumTime))
          user.premiumEndDate = newDate
        } else {
          const now = new Date()
          const newDate = new Date(now.setMonth(now.getMonth() + body.premiumTime))
          user.premiumEndDate = newDate
          user.isPremium = true
        }

        await userRepository.update(user, {
          where: { id }
        })
        resolve(user)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    updateUser,
    addPremiumTime
  }
}
