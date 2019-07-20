const { expect } = require('chai')
const getUsecase = require('src/app/question/get')

describe('App -> Question Logic -> Get Request', () => {
  let useCase
  const mockData = [{
    examName: 'LGS',
    courseName: 'Matematik',
    subjectName: 'Sayilar'
  }]

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        findOne: () => mockData
      }

      useCase = getUsecase({
        questionRepository: MockRepository
      })
    })

    it('should display one record on success', async () => {
      const question = await useCase.getOne(1)
      expect(question).to.equal(mockData)
    })
  })

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        findOne: () => Promise.reject('Error')
      }

      useCase = getUsecase({
        questionRepository: MockRepository
      })
    })

    it('should display error on rejection', async () => {
      let error
      try {
        await useCase.getOne({ id: 1 })
      } catch (e) {
        error = e.message
      }
      expect(error).to.equal('Error')
    })
  })
})
