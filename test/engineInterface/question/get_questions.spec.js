/* eslint-env mocha */

const { questionRepository } = app.resolve('repository')

const {
  getOneQuestion
} = require('src/interfaces/engineInterface/interface')

describe('Engine Interface: GET QuestionEntity', () => {
  beforeEach(done => {
    questionRepository
      .destroy({ where: {} })
      .then(() =>
        questionRepository.create({
          examName: 'LGS',
          courseName: 'Matematik',
          subjectName: 'Sayilar',
          questionLink: 'some_question_link',
          correctAnswer: 4
        })
      )
      .then(user => {
        done()
      })
  })

  describe('Should return one user', () => {
    it('should return one user', async () => {
      try {
        const data = await getOneQuestion(1)
        expect(data).to.eql({
          id: 1,
          examName: 'LGS',
          courseName: 'Matematik',
          subjectName: 'Sayilar',
          questionLink: 'some_question_link',
          correctAnswer: 4
        })
      } catch (error) {
      }
    })

    it('should return error if id is out if range', async () => {
      try {
        await getOneQuestion(2)
      } catch (error) {
        expect(error.message).to.eql(`TypeError: Cannot destructure property \`dataValues\` of 'undefined' or 'null'.`)
      }
    })
  })
})
