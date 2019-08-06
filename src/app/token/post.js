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
    return new Promise(async (resolve, reject) => {
      try {
        const credentials = Token(body)
        const userCredentials = await userRepository.findOne({
          where: {
            email: credentials.email,
            isDeleted: 0
          }
        })

        const validatePass = userRepository.validatePassword(userCredentials.password)

        if (!validatePass(credentials.password)) {
          throw new Error('Invalid Credentials')
        }
        const signIn = webToken.signin()

        resolve({
          token: signIn({
            id: userCredentials.id,
            name: userCredentials.name,
            lastname: userCredentials.lastname,
            email: userCredentials.email
          }),
          id: userCredentials.id
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    validate
  }
}
