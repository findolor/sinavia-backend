const { expect } = require('chai')
const getUsecase = require('src/app/statistic/get')

describe('App -> Statistics Logic -> Get Request', () => {
  let useCase
  const mockData = [{
    examName: 'LGS',
    courseName: 'Matematik',
    subjectName: 'Sayilar',
    correctNumber: 0,
    incorrectNumber: 0,
    unansweredNumber: 0,
    userId: 1
  }]

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        findAll: () => mockData
      }

      useCase = getUsecase({
        statisticRepository: MockRepository
      })
    })

    it('should display one record on success', async () => {
      const question = await useCase.getBatch(1)
      expect(question).to.equal(mockData)
    })
  })

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        findAll: () => Promise.reject('Error')
      }

      useCase = getUsecase({
        statisticRepository: MockRepository
      })
    })

    it('should display error on rejection', async () => {
      let error
      try {
        await useCase.getBatch(1)
      } catch (e) {
        error = e
      }
      expect(error).to.equal('Error')
    })
  })
})
