const { User } = require('src/domain/user')

module.exports = ({ userRepository }) => {
  // code for getting all the items
  const updateUser = ({ id, body }) => {
    return new Promise(async (resolve, reject) => {
      try {
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
