const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')
const { getUser } = require('src/app/user')

module.exports = () => {
  const { repository: {questionRepository },
          repository: { userRepository }
  } = container.cradle

  const getUseCase = get({ questionRepository })
  /* const postUseCase = post({ questionRepository })
  const putUseCase = put({ questionRepository })
  const deleteUseCase = remove({ questionRepository }) */

  const getUserUseCase = getUser({ userRepository })

  return {
    getUseCase,
    getUserUseCase
  }
}
