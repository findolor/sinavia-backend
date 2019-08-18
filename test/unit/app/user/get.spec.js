
const { expect } = require('chai')
const getUsecase = require('src/app/user/get')
const Sequelize = require('sequelize')

describe('App -> User Logic -> Get Request', () => {
  let useCase
  const mockData = [{
    name: 'Test',
    lastname: 'Developer'
  }]

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        findOne: () => mockData
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
  })

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        findOne: () => Promise.reject('Error')
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
      expect(error).to.equal('Error')
    })
  })
})
