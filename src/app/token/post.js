/**
 * this file will hold all the get use-case for user domain
 */
const Token = require('src/domain/token')

/**
 * function for getter user.
 */
module.exports = ({ userRepository, webToken }) => {
  // code for getting all the items
  const validate = ({ body, deviceId }) => {
    return Promise.resolve().then(async () => {
      const credentials = Token(body)
      let userCredentials = await userRepository.findOne({
        where: {
          email: credentials.email
        }
      })

      if (userCredentials === null) throw new Error('Invalid User')

      const { dataValues } = userCredentials
      userCredentials = dataValues

      const validatePass = userRepository.validatePassword(
        userCredentials.password
      )

      if (userCredentials.signInMethod === 'normal' && !validatePass(credentials.password)) {
        throw new Error('Invalid Credentials')
      }
      const signIn = webToken.signin()

      // If the user logs in from a different device
      // We save it and make sure that they don't log in from two devices later
      if (userCredentials.deviceId !== deviceId) {
        userCredentials.deviceId = deviceId
        await userRepository.update(userCredentials, {
          where: {
            id: userCredentials.id
          }
        })
      }

      return {
        token: signIn({
          id: userCredentials.id,
          name: userCredentials.name,
          lastname: userCredentials.lastname,
          email: userCredentials.email
        }),
        id: userCredentials.id
      }
    })
  }

  return {
    validate
  }
}
