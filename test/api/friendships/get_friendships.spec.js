/* eslint-env mocha */

const { userRepository } = app.resolve('repository')
const { friendshipRepository } = app.resolve('repository')

describe('Routes: GET Friendships', () => {
  const BASE_URI = `/api/${config.version}`

  const signIn = app.resolve('jwt').signin()
  let token
  let userIds
  let friendshipId

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
            userRepository.create({
              name: 'Test3',
              lastname: 'Dev3',
              username: 'testus3',
              email: 'testdev3@gmail.com',
              password: 'pass',
              city: 'siti',
              birthDate: '3123123123',
              profilePicture: 'dsdsds',
              coverPicture: 'cddcdcdc',
              fcmToken: 'sdasd'
            })
              .then(user => {
                userIds.push(user.id)
                userRepository.create({
                  name: 'Test4',
                  lastname: 'Dev4',
                  username: 'testus4',
                  email: 'testdev4@gmail.com',
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
                      friendId: userIds[1],
                      friendshipStatus: 'approved'
                    })
                      .then(friendship => {
                        friendshipId = friendship.id
                        friendshipRepository.create({
                          userId: userIds[0],
                          friendId: userIds[2],
                          friendshipStatus: 'approved'
                        })
                          .then(() => {
                            friendshipRepository.create({
                              userId: userIds[0],
                              friendId: userIds[3]
                            }).then(done())
                          })
                      })
                  })
              })
          })
      })
  })

  describe('Should return friendship', () => {
    it('should return friendship between two users', done => {
      request
        .get(`${BASE_URI}/friendships`)
        .query({ userId: userIds[0], opponentId: userIds[1] })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.data).to.eql([{
            userId: userIds[0],
            friendId: userIds[1],
            friendshipStatus: 'approved',
            id: friendshipId
          }])
          done(err)
        })
    })

    it('should return friendships a user has', done => {
      request
        .get(`${BASE_URI}/friendships/${userIds[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.data).to.eql([userIds[1], userIds[2]])
          done(err)
        })
    })

    it('Should return requested friendships', done => {
      request
        .get(`${BASE_URI}/friendships/requested/${userIds[3]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.data).to.eql([userIds[0]])
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
