module.exports = ({ questionRepository }) => {
  const getOne = ({ id }) => {
    return Promise
      .resolve()
      .then(() => {
        return questionRepository.findOne({
          where: {
            id: id
          }
        })
      })
  }

  const getMultiple = ({ idList, matchInformation }) => {
    return Promise
      .resolve()
      .then(() => {
        const questionList = questionRepository.findAll({
          where: {
            id: idList,
            examName: matchInformation.examName,
            subjectName: matchInformation.subjectName,
            courseName: matchInformation.courseName
          }
        })
        return questionList
      })
  }

  return {
    getOne,
    getMultiple
  }
}
