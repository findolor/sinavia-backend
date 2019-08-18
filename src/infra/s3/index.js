const s3service = require('./s3service')

module.exports = ({ config, logger }) => {
  return {
    getFile: (bucket, key) => {
      return s3service({ config, logger }).getFile(bucket, key)
    },
    generatePresignedGetUrl: (bucket, key) => {
      return s3service({ config, logger }).generatePresignedGetUrl(bucket, key)
    },
    generatePresignedUploadUrl: (bucket, key) => {
      return s3service({ config, logger }).generatePresignedUploadUrl(bucket, key)
    }
  }
}
