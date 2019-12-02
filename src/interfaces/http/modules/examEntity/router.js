const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getExamEntityUseCase,
  logger,
  auth,
  nodeCache,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // Gets one exam entity from db
  router
    .get('/:examId', (req, res) => {
      getExamEntityUseCase
        .getOne({ examId: req.params.examId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .get('/:examId/full', (req, res) => {
      getExamEntityUseCase
        .getFullExamInformation({ examId: req.params.examId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .get('/', (req, res) => {
      // Getting the cached value
      nodeCache.getValue('gameContent').then(data => {
        if (data === undefined) {
          res.status(Status.OK).json(Fail(data))
          return
        }
        // We first parse it
        data = JSON.parse(data)

        const gameContentMap = {
          exams: [],
          courses: [],
          subjects: []
        }
        data.sort((a, b) => a.id - b.id)
        data.forEach(examEntity => {
          gameContentMap.exams.push({
            id: examEntity.id,
            name: examEntity.name,
            examDate: examEntity.examDate
          })
          examEntity.courseEntities.sort((a, b) => a.id - b.id)
          examEntity.courseEntities.forEach(courseEntity => {
            courseEntity.subjectEntities.sort((a, b) => a.id - b.id)
            gameContentMap.courses.push({
              id: courseEntity.id,
              name: courseEntity.name,
              examId: courseEntity.examId
            })
            courseEntity.subjectEntities.forEach(subjectEntity => {
              gameContentMap.subjects.push({
                id: subjectEntity.id,
                name: subjectEntity.name,
                courseId: subjectEntity.courseId
              })
            })
          })
        })

        res.status(Status.OK).json(Success({
          data: data,
          gameContentMap: gameContentMap
        }))
      })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
