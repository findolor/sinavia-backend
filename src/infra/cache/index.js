const NodeCache = require('node-cache')

module.exports = () => {
  const myCache = new NodeCache()

  const flushAllData = () => {
    myCache.flushAll()
  }

  const listAllKeys = () => {
    return Promise
      .resolve()
      .then(() => {
        return myCache.keys()
      })
  }
  const setValue = (key, value) => {
    return Promise
      .resolve()
      .then(() => {
        value = JSON.stringify(value)
        return myCache.set(key, value)
      })
  }
  const getValue = (key) => {
    return Promise
      .resolve()
      .then(() => {
        return myCache.get(key)
      })
  }
  const deleteKey = (key) => {
    return Promise
      .resolve()
      .then(() => {
        return myCache.del(key)
      })
  }

  return {
    flushAllData,
    listAllKeys,
    setValue,
    getValue,
    deleteKey
  }
}
