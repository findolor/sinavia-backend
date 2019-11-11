const { encryptPassword } = require('src/infra/encryption')
const moment = require('moment')
moment.locale('tr')

const coverPicture = 'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/coverPictures%2FdefaultCoverPicture.png?alt=media&token=0377e5ce-ed5a-45d4-b8a9-661961729d92'
const profilePicture = 'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/profilePictures%2FdefaultProfilePicture.png?alt=media&token=35aba6a0-0b4e-4721-a5f3-25468c89e9e7'

module.exports = () => {
  const password = encryptPassword('password')

  return [
    {
      id: '4973ef67-cc68-4702-8082-f9ea6b69a463',
      username: 'Kullanici1',
      name: 'kullanici',
      lastname: '1',
      email: 'kullanici1@gmail.com',
      password: password,
      city: 'sehir',
      birthDate: new Date(),
      deviceId: 'E6559387-A6D2-4CCD-903A-3C8D2F936AD0',
      profilePicture: profilePicture,
      coverPicture: coverPicture,
      isPremium: false
    },
    {
      id: 'c4b812f2-78d5-4bc3-a46a-87a03bdf97fc',
      username: 'Kullanici2',
      name: 'kullanici',
      lastname: '2',
      email: 'kullanici2@gmail.com',
      password: password,
      city: 'sehir',
      birthDate: new Date(),
      deviceId: '6B58287D-49D3-452F-832C-5FFA0DE4EEB8',
      profilePicture: profilePicture,
      coverPicture: coverPicture,
      isPremium: false
    },
    {
      id: 'b46c9693-c17d-498a-adf6-bd618c23f4b3',
      username: 'Kullanici3',
      name: 'kullanici',
      lastname: '3',
      email: 'kullanici3@gmail.com',
      password: password,
      city: 'sehir',
      birthDate: new Date(),
      deviceId: '9B2B72B8-4AB3-4522-9D4F-44A357160F6A',
      profilePicture: profilePicture,
      coverPicture: coverPicture,
      isPremium: false
    },
    {
      id: '08f228a0-443b-4003-8b17-efe835cf6916',
      username: 'Marmelade',
      name: 'Arda',
      lastname: 'Nakisci',
      email: 'littlepossum66@gmail.com',
      password: password,
      deviceId: '6B58287D-49D3-452F-832C-5FFA0DE4EEB8',
      profilePicture: profilePicture,
      coverPicture: coverPicture,
      isPremium: true,
      premiumEndDate: moment().add(1, 'weeks').toDate()
    },
    {
      id: '72b6fa48-94c0-4691-8ac9-db679a67a9b3',
      username: 'Shellbreaker',
      name: 'Daar',
      lastname: 'Kinasci',
      email: 'anakisci@gmail.com',
      password: password,
      deviceId: 'CEAD0717-2323-4621-BB1E-AE9FA5624205',
      profilePicture: profilePicture,
      coverPicture: coverPicture,
      isPremium: true,
      premiumEndDate: moment().add(1, 'weeks').toDate()
    }
  ]
}
