module.exports = ({ gameEnergyRepository }) => {
  const update = ({ body }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await gameEnergyRepository.update(body, {
          where: {
            userId: body.userId
          }
        })

        resolve(body)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    update
  }
}
