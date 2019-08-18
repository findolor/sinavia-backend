const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getQPicURLUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())
  /**
   * @swagger
   * /question:
   *   delete:
   *     tags:
   *       - Questions
   *     description: Get question picture url
   *     security:
   *       - JWT: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: key
   *         in: path
   *         required: true
   *         description: Questions picture key
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully retrieved
   *         schema:
   *           $ref: '#/definitions/question'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  router.get('/', (req, res) => {
    getQPicURLUseCase
      .getQPicURL({ key: req.query.key })
      .then(data => {
        res.status(Status.OK).json(Success(data))
      })
      .catch(error => {
        logger.error(error.stack)
        res.status(Status.BAD_REQUEST).json(Fail(error.message))
      })
  })
  return router
}
