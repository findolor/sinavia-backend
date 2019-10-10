const { encryptPassword } = require('src/infra/encryption')

module.exports = () => {
  const password = encryptPassword('pass')

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
      profilePicture: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
      coverPicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsqp6g6oM5OS7VVBPZFfxICh0niuPUx8e8Rl4m-YzlVRkTUHG'
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
      profilePicture: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
      coverPicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsqp6g6oM5OS7VVBPZFfxICh0niuPUx8e8Rl4m-YzlVRkTUHG'
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
      profilePicture: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
      coverPicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsqp6g6oM5OS7VVBPZFfxICh0niuPUx8e8Rl4m-YzlVRkTUHG'
    }
  ]
}
