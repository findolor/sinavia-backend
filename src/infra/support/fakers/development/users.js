const { encryptPassword } = require('src/infra/encryption')

module.exports = () => {
  const password = encryptPassword('pass')

  return [
    {
      id: '48e40a9c-c5e9-4d63-9aba-b77cdf4ca67b',
      username: 'Test Username',
      name: 'Test',
      lastname: 'Developer',
      email: 'testdev@gmail.com',
      password: password,
      city: 'Test City',
      birthDate: (new Date()),
      profilePicture: 'Test Profile Picture',
      coverPicture: 'Test Cover Picture'
    },
    {
      id: '4973ef67-cc68-4702-8082-f9ea6b69a463',
      username: 'Kullanici1',
      name: 'kullanici',
      lastname: '1',
      email: 'kullanici1@gmail.com',
      password: password,
      city: 'sehir',
      birthDate: (new Date()),
      profilePicture: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
      coverPicture: 'Test Cover Picture'
    },
    {
      id: 'c4b812f2-78d5-4bc3-a46a-87a03bdf97fc',
      username: 'Kullanici2',
      name: 'kullanici',
      lastname: '2',
      email: 'kullanici2@gmail.com',
      password: password,
      city: 'sehir',
      birthDate: (new Date()),
      profilePicture: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
      coverPicture: 'Test Cover Picture'
    }
  ]
}
