module.exports = {
  local: {
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD
  },
  test: {
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD
  },
  prod: {
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD
  }
}
