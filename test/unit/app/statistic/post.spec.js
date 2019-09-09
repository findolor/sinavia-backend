const { expect } = require('chai')
const postUseCase = require('src/app/statistic/post')

describe('App -> Statistics Logic -> Post Request', () => {
  let useCase

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        create: (data) => data
      }

      useCase = postUseCase({
        statisticRepository: MockRepository
      })
    })

    it('should display one record on success', async () => {
      const gameResults = {
        examName: 'test',
        courseName: 'test',
        subjectName: 'test',
        correctNumber: 0,
        incorrectNumber: 0,
        unansweredNumber: 0,
        userId: 'test'
      }

      const statistic = await useCase.createStat({ gameResults })
      expect(statistic.userId).to.equal('test')
      expect(statistic.examName).to.equal('test')
      expect(statistic.correctNumber).to.equal(0)
    })
  })

  describe('Fail path', () => {
    const gameResults = {
      examName: 'test',
      courseName: 'test',
      subjectName: 'test',
      correctNumber: 0,
      incorrectNumber: 0,
      unansweredNumber: 0,
      userId: 'test'
    }

    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        create: () => Promise.reject('Error')
      }

      useCase = postUseCase({
        statisticRepository: MockRepository
      })
    })

    it('should display error on rejection', async () => {
      let error
      try {
        await useCase.createStat({ gameResults })
      } catch (e) {
        error = e
      }
      expect(error).to.equal('Error')
    })
  })
})
