/* eslint-env mocha */

const { userRepository } = app.resolve('repository')
const { statisticRepository } = app.resolve('repository')

describe('Routes: GET StatisticEntity', () => {
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

        statisticRepository
          .destroy({ where: {} })
          .then(() => {
            statisticRepository.create({
              examName: 'Exam',
              courseName: 'Course',
              subjectName: 'Subject',
              correctNumber: 0,
              incorrectNumber: 0,
              unansweredNumber: 0,
              userId: userId
            })
              .then(() => {
                statisticRepository.create({
                  examName: 'Exam',
                  courseName: 'Course',
                  subjectName: 'Subject',
                  correctNumber: 0,
                  incorrectNumber: 0,
                  unansweredNumber: 0,
                  userId: userId
                })
                  .then(() => {
                    done()
                  })
              })
          })
      })
  })

  describe('Should return two statistic', () => {
    it('should return two statistic', done => {
      request
        .get(`${BASE_URI}/statistics/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(Object.keys(res.body.data).length).to.eql(2)
          expect(Object.keys(res.body.data[0]).length).to.eql(8)
          expect(Object.keys(res.body.data[1]).length).to.eql(8)
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
