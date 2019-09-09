/* eslint-env mocha */

const { userRepository } = app.resolve('repository')
const { friendshipRepository } = app.resolve('repository')

describe('Routes: POST Friendships', () => {
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
          fcmToken: 'sdasd'
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
          fcmToken: 'sdasd'
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
              .then(done())
          })
      })
  })

  describe('Should return friendship', () => {
    it('should return updated friendship', done => {
      request
        .put(`${BASE_URI}/friendships`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: userIds[0],
          friendId: userIds[1],
          username: 'test',
          friendshipStatus: 'approved'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.data.userId).to.eql(userIds[0])
          expect(res.body.data.friendId).to.eql(userIds[1])
          expect(res.body.data.friendshipStatus).to.eql('approved')
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .get(`${BASE_URI}/users/${userIds[0]}`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
