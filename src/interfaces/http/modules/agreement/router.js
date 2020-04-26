const Status = require('http-status')
const { Router } = require('express')
const fs = require('fs')
const path = require('path')

module.exports = ({
  response: { Success, Fail }
}) => {
  const router = Router()

  router
    .get('/', (req, res) => {
      fs.readFile(path.join(__dirname, '/agreement.txt'), (error, data) => {
        if (error) {
          return res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        }
        res.status(Status.OK).json(Success(data.toString()))
      })
    })

  return router
}
