const { UserJoker } = require('src/domain/userJoker')

module.exports = ({ userJokerRepository }) => {
  const createUserJoker = ({ userJokerEntity }) => {
    return Promise.resolve().then(() => {
      const userJoker = UserJoker(userJokerEntity)

      return userJokerRepository.create(userJoker)
    })
  }

  return {
    createUserJoker
  }
}
