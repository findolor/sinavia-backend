/* eslint-env mocha */

const { userRepository } = app.resolve('repository')

describe('Routes: GET UsersEntity', () => {
  const BASE_URI = `/api/${config.version}`

  const signIn = app.resolve('jwt').signin()
  let token

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
          isDeleted: 0,
          city: 'siti',
          birthDate: '3123123123',
          profilePicture: 'dsdsds',
          coverPicture: 'cddcdcdc'
        })
      )
      .then(() =>
        userRepository.create({
          name: 'john',
          lastname: 'Doe',
          username: 'mrrrrr',
          email: 'test@gmail.com',
          password: 'passsss',
          isDeleted: 0,
          city: 'sidsds',
          birthDate: '3123123123',
          profilePicture: 'dsdsds',
          coverPicture: 'cddcdcdc'
        })
      )
      .then(user => {
        token = signIn({
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email
        })
        done()
      })
  })

  describe('Should return users', () => {
    it('should return all users', done => {
      request
        .get(`${BASE_URI}/users`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.data).to.have.length(2)
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .get(`${BASE_URI}/users`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
