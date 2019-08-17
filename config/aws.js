module.exports = {
  questionBucket: process.env.AWS_QUESTION_BUCKET,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  maxRetries: process.env.AWS_MAX_RETRIES,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  timeout: process.env.AWS_TIMEOUT
}
