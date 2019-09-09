/* eslint-env mocha */

const { userRepository } = app.resolve('repository')
const { friendsMatchRepository } = app.resolve('repository')

describe('Routes: GET QuestionEntity', () => {
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
          coverPicture: 'cddcdcdc'
        })
      )
      .then(user => {
        userIds.push(user.id)
        token = signIn({
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email
        })

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
            userIds.push(user.id)

            friendsMatchRepository.create({
              winnerId: userIds[0],
              loserId: userIds[1],
              isMatchDraw: false
            })
              .then(() => {
                friendsMatchRepository.create({
                  winnerId: userIds[0],
                  loserId: userIds[1],
                  isMatchDraw: true
                })
                  .then(done())
              })
          })
      })
  })

  describe('Should return matches between two friends', () => {
    it('should return 2 matches', done => {
      request
        .get(`${BASE_URI}/friendsMatches`)
        .query({ userId: userIds[0], friendId: userIds[1] })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(Object.keys(res.body.data).length).to.eq(2)
          expect(res.body.data[0].winnerId).to.eq(userIds[0])
          expect(res.body.data[1].loserId).to.eq(userIds[1])
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .get(`${BASE_URI}/friendsMatches`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
