const AWS = require('aws-sdk')
const awsConfig = require('aws-config')

module.exports = ({ config, logger }) => {
  const awsCfg = awsConfig({
    region: config.aws.region,
    maxRetries: config.aws.maxRetries,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    timeout: config.aws.timeout,
    signatureVersion: 'v4'
  })

  const s3 = new AWS.S3(awsCfg)

  const generatePresignedGetUrl = (bucket, key) => {
    const signedUrlExpireSeconds = 60 * 5 // TODO consider this duration

    const urlPromise = new Promise(resolve => {
      resolve(
        s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Key: key,
          Expires: signedUrlExpireSeconds
        })
      )
    })

    return urlPromise.then(url => {
      logger.info(`Generated presigned url for ${key}`)

      return url
    })
  }

  const getFile = ({ bucket, key }) => {
    const params = { Bucket: bucket, Key: key }

    return s3
      .getObject(params)
      .then(data => data)
      .catch(err => {
        // TODO test loggr
        logger.error(`could not retrieve file with ${key}`)
        throw new Error(err)
      })
  }

  const generatePresignedUploadUrl = ({ bucket, key }) => {
    const signedUrlExpireSeconds = 60 * 5 // TODO consider this duration

    const urlPromise = new Promise(resolve => {
      resolve(
        s3.getSignedUrl('putObject', {
          Bucket: bucket,
          Key: key,
          Expires: signedUrlExpireSeconds
        })
      )
    })

    return urlPromise.then(url => {
      logger.info(`Generated presigned s3 upload url for ${key}`)

      return url
    })
  }

  return {
    getFile,
    generatePresignedUploadUrl,
    generatePresignedGetUrl
  }
}
