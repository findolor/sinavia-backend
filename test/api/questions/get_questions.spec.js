/* eslint-env mocha */

const { userRepository } = app.resolve('repository')
const { questionRepository } = app.resolve('repository')

describe('Routes: GET QuestionEntity', () => {
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

        questionRepository
          .destroy({ where: {} })
          .then(() => {
            questionRepository.create({
              examName: 'LGS',
              courseName: 'Matematik',
              subjectName: 'Sayilar',
              questionLink: 'key',
              correctAnswer: 4
            })
              .then(() => {
                done()
              })
          })
      })
  })

  describe('Should return one question link', () => {
    it('should return one question link', done => {
      request
        .get(`${BASE_URI}/questions`)
        .query({ key: 'key' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.data)
          done(err)
        })
    })

    it('should return unauthorized if no token', done => {
      request
        .get(`${BASE_URI}/statistics/${userId}`)
        .expect(401)
        .end((err, res) => {
          expect(res.text).to.equals('Unauthorized')
          done(err)
        })
    })
  })
})
