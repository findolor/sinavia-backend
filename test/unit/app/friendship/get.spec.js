
const { expect } = require('chai')
const getUseCase = require('src/app/friendship/get')
const Sequelize = require('sequelize')

describe('App -> Friendship Logic -> Get Request', () => {
  let useCase
  const mockFriendList = [{
    userId: 1,
    friendId: 2,
    friendshipStatus: 'approved'
  }, {
    userId: 1,
    friendId: 3,
    friendshipStatus: 'approved'
  }, {
    userId: 1,
    friendId: 4,
    friendshipStatus: 'requested'
  }]

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        findAll: () => mockFriendList
      }

      useCase = getUseCase({
        friendshipRepository: MockRepository,
        Sequelize
      })
    })
    // TODO SOMETHING IS WRONG HERE
    it('should display one friendship record between two users on success', async () => {
      const user = await useCase.getFriendship({ userId: 1, opponentId: 2 })
      expect(user).to.equal(mockFriendList)
    })

    it('Should display multiple friendship records of a user on success', async () => {
      const users = await useCase.getFriends({ userId: 1 })
      expect(users).to.equal(mockFriendList)
    })

    it('Should display friendship requests of a user on success', async () => {
      const users = await useCase.getFriendRequests({ userId: 1 })
      expect(users).to.equal(mockFriendList)
    })
  })

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        findAll: () => Promise.reject(new Error('Error'))
      }

      useCase = getUseCase({
        friendshipRepository: MockRepository,
        Sequelize
      })
    })

    it('should display error on rejection', async () => {
      let error
      try {
        await useCase.getFriendship({ userId: 1, opponentId: 2 })
      } catch (e) {
        error = e
      }
      expect(error.message).to.equal('Error')

      try {
        await useCase.getFriends({ userId: 1 })
      } catch (e) {
        error = e
      }
      expect(error.message).to.equal('Error')

      try {
        await useCase.getFriendRequests({ userId: 1 })
      } catch (e) {
        error = e
      }
      expect(error.message).to.equal('Error')
    })
  })
})
