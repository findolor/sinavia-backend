/* eslint-env mocha */

const { userRepository } = app.resolve('repository')

describe('Routes: GET UserEntity', () => {
  const BASE_URI = `/api/${config.version}`

  const signIn = app.resolve('jwt').signin()
  let token
  let userId
  let userIdList

  beforeEach(done => {
    // we need to add user before we can request our token
    userIdList = []
    userRepository
      .destroy({ where: {} })
      .then(() =>
        userRepository.create({
          name: 'Test',
          lastname: 'Dev',
          username: 'testus',
          email: 'testdev1@gmail.com',
          password: 'pass',
          city: 'siti',
          birthDate: '3123123123',
          profilePicture: 'dsdsds',
          coverPicture: 'cddcdcdc'
        })
      )
      .then(user => {
        userIdList.push(user.id)
        userRepository.create({
          name: 'Test2',
          lastname: 'Dev2',
          username: 'testus2',
          email: 'testdev2@gmail.com',
          password: 'pass',
          city: 'siti',
          birthDate: '3123123123',
          profilePicture: 'dsdsds',
          coverPicture: 'cddcdcdc'
        })
          .then(user => {
            userId = user.id
            userIdList.push(user.id)
            token = signIn({
              id: user.id,
              name: user.name,
              lastname: user.lastname,
              email: user.email
            })
            done()
          })
      })
  })

  describe('Should return one user', () => {
    it('should return one user', done => {
      request
        .get(`${BASE_URI}/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.data).to.eql({
            id: userId,
            name: 'Test2',
            lastname: 'Dev2',
            username: 'testus2',
            email: 'testdev2@gmail.com',
            city: 'siti',
            birthDate: '3123123123',
            profilePicture: 'dsdsds',
            coverPicture: 'cddcdcdc'
          })
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .get(`${BASE_URI}/users/${userId}`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })

  describe('Should return two users', () => {
    it('should return two users', done => {
      request
        .get(`${BASE_URI}/users`)
        .query({ idList: userIdList })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(Object.keys(res.body.data).length).to.eql(2)
          expect(Object.keys(res.body.data[0]).length).to.eql(9)
          expect(Object.keys(res.body.data[1]).length).to.eql(9)
          done(err)
        })
    })
  })
})
