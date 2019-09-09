
const { expect } = require('chai')
const getUsecase = require('src/app/user/get')
const Sequelize = require('sequelize')

describe('App -> User Logic -> Get Request', () => {
  let useCase
  const mockData = [{
    name: 'Test',
    lastname: 'Developer'
  }]
  const mockDataList = [{
    name: 'Test',
    lastname: 'Developer'
  }, {
    name: 'Test',
    lastname: 'Developer'
  }]

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        findOne: () => mockData,
        findAll: () => mockDataList
      }

      useCase = getUsecase({
        userRepository: MockRepository,
        Sequelize
      })
    })

    it('should display one record on success', async () => {
      const user = await useCase.getOne(1)
      expect(user).to.equal(mockData)
    })

    it('Should display multiple records on success', async () => {
      const users = await useCase.getMultiple([1, 2])
      expect(users).to.equal(mockDataList)
    })

    it('Should display one record with given keyword on success', async () => {
      const users = await useCase.getUserWithKeyword('test', 1)
      expect(users).to.equal(mockDataList)
    })
  })

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        findOne: () => Promise.reject(new Error('Error')),
        findAll: () => Promise.reject(new Error('Error'))
      }

      useCase = getUsecase({
        userRepository: MockRepository,
        Sequelize
      })
    })

    it('should display error on rejection', async () => {
      let error
      try {
        await useCase.getOne(1)
      } catch (e) {
        error = e
      }
      expect(error.message).to.equal('Error')

      try {
        await useCase.getMultiple([1, 2])
      } catch (e) {
        error = e
      }
      expect(error.message).to.equal('Error')

      try {
        await useCase.getMultiple('test', [1, 2])
      } catch (e) {
        error = e
      }
      expect(error.message).to.equal('Error')
    })
  })
})
