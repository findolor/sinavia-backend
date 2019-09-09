/* eslint-env mocha */
const { userRepository } = app.resolve('repository')
const { friendshipRepository } = app.resolve('repository')

describe('Routes: DELETE Friendships', () => {
  const BASE_URI = `/api/${config.version}`

  const signIn = app.resolve('jwt').signin()
  let token
  let userIds

  beforeEach(done => {
    userIds = []
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
          coverPicture: 'cddcdcdc',
          fcmToken: 'dsdsds'
        })
      )
      .then(user => {
        userIds.push(user.id)
        userRepository.create({
          name: 'Test2',
          lastname: 'Dev2',
          username: 'testus2',
          email: 'testdev2@gmail.com',
          password: 'pass',
          city: 'siti',
          birthDate: '3123123123',
          profilePicture: 'dsdsds',
          coverPicture: 'cddcdcdc',
          fcmToken: 'dsdsds'
        })
          .then(user => {
            userIds.push(user.id)
            token = signIn({
              id: user.id,
              name: user.name,
              lastname: user.lastname,
              email: user.email
            })

            friendshipRepository.create({
              userId: userIds[0],
              friendId: userIds[1]
            })
              .then(() => {
                done()
              })
          })
      })
  })

  describe('Should DELETE friendship', () => {
    it('should delete user', done => {
      request
        .delete(`${BASE_URI}/friendships`)
        .query({ userId: userIds[0], friendId: userIds[1], isClientUser: true })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.success).to.eql(true)
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .delete(`${BASE_URI}/friendships/${userIds[0]}`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
