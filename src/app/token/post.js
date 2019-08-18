/**
 * this file will hold all the get use-case for user domain
 */
const Token = require('src/domain/token')

/**
 * function for getter user.
 */
module.exports = ({ userRepository, webToken }) => {
  // code for getting all the items
  const validate = ({ body }) => {
    return Promise.resolve().then(async () => {
      const credentials = Token(body)
      const userCredentials = await userRepository.findOne({
        where: {
          email: credentials.email
        }
      })

      const validatePass = userRepository.validatePassword(
        userCredentials.password
      )

      if (!validatePass(credentials.password)) {
        throw new Error('Invalid Credentials')
      }
      const signIn = webToken.signin()

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
