const container = require('src/container') // we have to get the DI
const { getUserJoker, putUserJoker } = require('src/app/userJoker')

module.exports = () => {
  const {
    repository: { userJokerRepository },
    database
  } = container.cradle

  const getUserJokerUseCase = getUserJoker({ userJokerRepository, database })
  const putUserJokerUseCase = putUserJoker({ userJokerRepository })

  return {
    getUserJokerUseCase,
    putUserJokerUseCase
  }
}
