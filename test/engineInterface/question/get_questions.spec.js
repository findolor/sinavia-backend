/* eslint-env mocha */

const { questionRepository } = app.resolve('repository')

const {
  getOneQuestion
} = require('src/interfaces/engineInterface/interface')

describe('Engine Interface: GET QuestionEntity', () => {
  let questionId

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
      .then(question => {
        questionId = question.id
        done()
      })
  })

  describe('Should return one question', () => {
    it('should return one question', async () => {
      const data = await getOneQuestion(questionId)
      expect(data).to.eql({
        id: questionId,
        examName: 'LGS',
        courseName: 'Matematik',
        subjectName: 'Sayilar',
        questionLink: 'some_question_link',
        correctAnswer: 4
      })
    })

    it('should return error if id is out if range', async () => {
      try {
        await getOneQuestion(10)
      } catch (error) {
        expect(error.message).to.eql(`TypeError: Cannot destructure property \`dataValues\` of 'undefined' or 'null'.`)
      }
    })
  })
})
