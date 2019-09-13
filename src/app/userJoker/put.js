const { UserJoker } = require('src/domain/userJoker')

module.exports = ({ userJokerRepository }) => {
  const updateUserJoker = ({ userJokerEntity }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userJoker = UserJoker(userJokerEntity)

        await userJokerRepository.update(userJoker, {
          where: {
            userId: userJokerEntity.userId,
            jokerId: userJokerEntity.jokerId
          }
        })

        resolve(userJoker)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    updateUserJoker
  }
}
