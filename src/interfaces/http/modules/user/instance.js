const container = require('src/container') // we have to get the DI
const { getUser, postUser, putUser, removeUser } = require('src/app/user')
const { getFriendsMatch } = require('src/app/friendsMatch')
// const { postGameEnergy } = require('src/app/gameEnergy')
const { postUserJoker } = require('src/app/userJoker')
const { postInviteCode, deleteInviteCode, getInviteCode } = require('src/app/inviteCode')
const { postAppleIdentityToken, getAppleIdentityToken } = require('src/app/appleIdentityToken')
const Sequelize = require('sequelize')

module.exports = () => {
  const {
    repository: { userRepository },
    repository: { friendsMatchRepository },
    // repository: { gameEnergyRepository },
    repository: { userJokerRepository },
    repository: { inviteCodeRepository },
    repository: { appleIdentityTokenRepository },
    database
  } = container.cradle

  const getUseCase = getUser({ userRepository, Sequelize, database })
  const postUseCase = postUser({ userRepository })
  const putUseCase = putUser({ userRepository })
  const deleteUseCase = removeUser({ userRepository })
  const getFriendsMatchUseCase = getFriendsMatch({ friendsMatchRepository, Sequelize })
  // const postGameEnergyUseCase = postGameEnergy({ gameEnergyRepository })
  const postUserJokerUseCase = postUserJoker({ userJokerRepository })
  const postInviteCodeUseCase = postInviteCode({ inviteCodeRepository })
  const deleteInviteCodeUseCase = deleteInviteCode({ inviteCodeRepository })
  const getInviteCodeUseCase = getInviteCode({ inviteCodeRepository, database })
  const postAppleIdentityTokenUseCase = postAppleIdentityToken({ appleIdentityTokenRepository })
  const getAppleIdentityTokenUseCase = getAppleIdentityToken({ appleIdentityTokenRepository, database })

  return {
    getUseCase,
    postUseCase,
    putUseCase,
    deleteUseCase,
    getFriendsMatchUseCase,
    // postGameEnergyUseCase
    postUserJokerUseCase,
    postInviteCodeUseCase,
    deleteInviteCodeUseCase,
    getInviteCodeUseCase,
    postAppleIdentityTokenUseCase,
    getAppleIdentityTokenUseCase
  }
}
