/* eslint-env mocha */

const { userRepository } = app.resolve('repository')

describe('Routes: GET SearchUserEntity', () => {
  const BASE_URI = `/api/${config.version}`

  const signIn = app.resolve('jwt').signin()
  let token
  let userId

  beforeEach(done => {
    // we need to add user before we can request our token
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
      .then(() => {
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

  describe('Should return one users', () => {
    it('should return one users', done => {
      request
        .get(`${BASE_URI}/searchUsers`)
        .query({ keyword: 'e', userId: userId })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(Object.keys(res.body.data).length).to.eql(1)
          expect(Object.keys(res.body.data[0]).length).to.eql(9)
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .get(`${BASE_URI}/searchUsers/${userId}`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
