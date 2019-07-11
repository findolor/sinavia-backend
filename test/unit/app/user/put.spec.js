
const { expect, use } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const updateUsecase = require('src/app/user/put')

use(sinonChai)

describe('App -> User -> Put', () => {
  const body = {
    username: 'username',
    name: 'test',
    lastname: 'dev',
    email: 'test@gmail.com',
    isDeleted: 0,
    city: 'siti',
    birthDate: '3123123123',
    profilePicture: 'dsdsds',
    coverPicture: 'cddcdcdc'
  }
  let useCase
  let method

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        update: (data) => data
      }

      method = sinon.spy(MockRepository, 'update')
      useCase = updateUsecase({
        userRepository: MockRepository
      })
    })

    it('should have called delete method of userRepository', async () => {
      await useCase.update({ id: 1, body })
      // eslint-disable-next-line
      expect(method).to.have.been.called
    })
  })

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        update: () => Promise.reject('Error')
      }

      useCase = updateUsecase({
        userRepository: MockRepository
      })
    })

    it('should display error on rejection', async () => {
      let error
      try {
        await useCase.update({ id: 1, body })
      } catch (e) {
        error = e
      }
      expect(error).to.equal('Error')
    })
  })
})
