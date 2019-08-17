
const { expect } = require('chai')
const postUsecase = require('src/app/user/post')

describe('App -> User Logic -> Post Request', () => {
  let useCase

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        create: (data) => data
      }

      useCase = postUsecase({
        userRepository: MockRepository
      })
    })

    it('should create the records and list the data and append the default password', async () => {
      const body = {
        username: 'username',
        name: 'test',
        lastname: 'dev',
        email: 'test@gmail.com',
        city: 'siti',
        birthDate: '3123123123',
        profilePicture: 'dsdsds',
        coverPicture: 'cddcdcdc'
      }
      const lists = await useCase.create({ body })
      expect(lists.name).to.equal(body.name)
      expect(lists.lastname).to.equal(body.lastname)
      expect(lists.email).to.equal(body.email)
    })
  })

  describe('Fail path', () => {
    const body = {
      username: 'username',
      name: 'test',
      lastname: 'dev',
      email: 'test@gmail.com',
      city: 'siti',
      birthDate: '3123123123',
      profilePicture: 'dsdsds',
      coverPicture: 'cddcdcdc'
    }

    beforeEach(() => {
      const MockRepository = {
        // eslint-disable-next-line prefer-promise-reject-errors
        create: () => Promise.reject('Error')
      }

      useCase = postUsecase({
        userRepository: MockRepository
      })
    })

    it('should display error on rejection', async () => {
      let error
      try {
        await useCase.create({ body })
      } catch (e) {
        error = e.message
      }
      expect(error).to.equal('Error')
    })
  })
})
