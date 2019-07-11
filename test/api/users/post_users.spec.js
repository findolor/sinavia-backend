/* eslint-env mocha */
const { userRepository } = app.resolve('repository')

describe('Routes: POST Users', () => {
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

  describe('Should post users', () => {
    it('should return create user', done => {
      request
        .post(`${BASE_URI}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send({
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
        .expect(200)
        .end((err, res) => {
          expect(res.body.data.name).to.eql('john')
          expect(res.body.data.lastname).to.eql('Doe')
          expect(res.body.data.email).to.eql('test@gmail.com')
          done(err)
        })
    })

    it('should validate user object is not complete', done => {
      request
        .post(`${BASE_URI}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'John',
          lastname: 'Doe',
          email: 'dsdss'
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.include.keys('error')
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .post(`${BASE_URI}/users`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
