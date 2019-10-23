const Status = require('http-status')
const { Router } = require('express')
const moment = require('moment')
moment.locale('tr')

module.exports = ({
  getGameEnergyUseCase,
  putGameEnergyUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // We check if the energy is needed to be renewed
  router
    .get('/:id', (req, res) => {
      getGameEnergyUseCase
        .getOne({ userId: req.params.id })
        .then(data => {
          const renewedDate = moment(data.dateRenewed).format('MDD')
          const currentDate = moment().format('MDD')

          if (currentDate > renewedDate) {
            if (data.shouldRenew) {
              // 6 is the given energy count for every player
              // If usedEnergy is less then 6 we subtract the number from 6 and add that amount
              // If it is equal to 6 and more we add 6
              if (data.energyUsed < 6) {
                data.energyAmount += data.energyUsed
              } else data.energyAmount += 6
              // We mark shouldRenew false
              data.shouldRenew = false
              // We mark the new date
              data.dateRenewed = new Date()
              // We mark usedEnergy after renewing to 0
              data.energyUsed = 0

              putGameEnergyUseCase
                .update({ body: data })
                .then(updatedData => {
                  res.status(Status.OK).json(Success(updatedData))
                })
                .catch(error => {
                  logger.error(error.stack)
                  res.status(Status.BAD_REQUEST).json(Fail(error.message))
                })
            } else res.status(Status.OK).json(Success(data))
          } else res.status(Status.OK).json(Success(data))
        })
        .catch(error => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(Fail(error.message))
        })
    })

  router
    .put('/remove/:id', (req, res) => {
      getGameEnergyUseCase
        .getOne({ userId: req.params.id })
        .then(data => {
          data.energyAmount--
          data.energyUsed++
          data.shouldRenew = true

          putGameEnergyUseCase
            .update({ body: data })
            .then(updatedData => {
              res.status(Status.OK).json(Success(updatedData))
            })
            .catch(error => {
              logger.error(error.stack)
              res.status(Status.BAD_REQUEST).json(Fail(error.message))
            })
        })
        .catch(error => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(Fail(error.message))
        })
    })

  return router
}
