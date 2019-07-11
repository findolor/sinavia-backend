const { encryptPassword } = require('src/infra/encryption')

module.exports = () => {
  const password = encryptPassword('pass')

  return [{
    id: '48e40a9c-c5e9-4d63-9aba-b77cdf4ca67b',
    username: 'Test Username',
    name: 'Test',
    lastname: 'Developer',
    email: 'testdev@gmail.com',
    password: password,
    isDeleted: 0,
    city: 'Test City',
    birthDate: (new Date()).toISOString(),
    profilePicture: 'Test Profile Picture',
    coverPicture: 'Test Cover Picture'
    /* userLevel: {
      'lgs': {
        'matematik': 10
      }
    }, */
  }]
}
