/* eslint-env mocha */
const { userRepository } = app.resolve('repository')

describe('Routes: PUT Users', () => {
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

  describe('Should PUT users', () => {
    it('should update user', done => {
      request
        .put(`${BASE_URI}/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'John',
          lastname: 'Doe',
          username: 'testus',
          email: 'testdev1@gmail.com',
          password: 'pass',
          city: 'siti',
          birthDate: '3123123123',
          profilePicture: 'dsdsds',
          coverPicture: 'cddcdcdc'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.data.name).to.eql('John')
          expect(res.body.data.lastname).to.eql('Doe')
          done(err)
        })
    })

    it('should validate user object is not complete', done => {
      request
        .put(`${BASE_URI}/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'dsdsdsd'
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.include.keys('error')
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .put(`${BASE_URI}/users/${userId}`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
