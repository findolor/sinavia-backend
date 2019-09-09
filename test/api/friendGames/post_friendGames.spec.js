/* eslint-env mocha */

const { userRepository } = app.resolve('repository')

describe('Routes: POST FriendGame', () => {
  const BASE_URI = `/api/${config.version}`

  const signIn = app.resolve('jwt').signin()
  let token
  let userId
  let FCMToken = 'dOEs6FgE_64:APA91bE1S063wFl9ctUrSxUa5zRp2bjlC8gRTIf6cCzcaXaGxWWlYXYoRY_fkU0CY7JjG3UXAYlRLGKRGP5g6jbJKvqTa1zXXHzFCqEAuK81c2HphCqh6IVNEz-yi1FdiDQj1mDNTMh7'

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
      )
  })

  describe('Should return true', () => {
    it('should return true upon successfull game request', done => {
      request
        .post(`${BASE_URI}/friendGames`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: userId,
          roomCode: 'test',
          username: 'test',
          requestedUserFCMToken: FCMToken
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.data).to.eql(true)
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .get(`${BASE_URI}/friendGames`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
