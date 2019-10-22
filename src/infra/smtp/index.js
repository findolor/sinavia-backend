const nodemailer = require('nodemailer')

module.exports = ({ config, logger }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.smtp.email,
      pass: config.smtp.password
    }
  })

  return {
    sendEmail: (recipient, subject, text) => {
      const mailOptions = {
        from: config.smtp.email,
        to: recipient,
        subject: subject,
        text: text
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(error.stack)
        } else {
          logger.info('Email sent: ' + info.response)
        }
      })
    }
  }
}
