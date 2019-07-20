const container = require('src/container') // we have to get the DI
const { get } = require('src/app/question')

module.exports = () => {
  const { repository: {
    questionRepository
  } } = container.cradle

  const getUseCase = get({ questionRepository })
  /* const postUseCase = post({ questionRepository })
  const putUseCase = put({ questionRepository })
  const deleteUseCase = remove({ questionRepository }) */

  return {
    getUseCase
  }
}
