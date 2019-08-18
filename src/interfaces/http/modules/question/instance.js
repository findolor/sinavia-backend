const container = require('src/container') // we have to get the DI
const { getQPicURL } = require('src/app/question')

module.exports = () => {
  const {
    config,
    s3service
  } = container.cradle

  const getQPicURLUseCase = getQPicURL({
    config,
    s3service
  })

  return {
    getQPicURLUseCase
  }
}
