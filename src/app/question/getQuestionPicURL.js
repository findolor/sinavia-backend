module.exports = ({ config, s3service }) => {
  // Generates question picture retrieval url from s3
  const getQPicURL = ({ key }) => {
    return Promise
      .resolve()
      .then(() => {
        const questionBucket = config.aws.questionBucket
        return s3service.generatePresignedGetUrl(questionBucket, key)
      })
      .catch(error => {
        // TODO logger
        console.log(error.message)
        throw new Error(error)
      })
  }

  return {
    getQPicURL
  }
}
