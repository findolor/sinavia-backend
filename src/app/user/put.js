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

        body.premiumEndDate = new Date(body.premiumEndDate)

        const user = User(body)
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
    updateUser
  }
}
