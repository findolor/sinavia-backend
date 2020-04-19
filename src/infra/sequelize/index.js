const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

module.exports = ({ config, basePath }) => {
  const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      port: config.db.port,
      host: config.db.host,
      dialect: 'postgres',
      logging: false,
      dialectOptions: config.db.dialectOptions,
      ssl: {
        ca: fs.readFileSync('./secrets/server-ca.pem').toString(),
        key: fs.readFileSync('./secrets/client-key.pem').toString(),
        cert: fs.readFileSync('./secrets/client-cert.pem').toString()
      }
    }
  )

  const db = {
    sequelize,
    Sequelize,
    models: {}
  }

  const dir = path.join(basePath, './models')
  fs.readdirSync(dir).forEach(file => {
    const modelDir = path.join(dir, file)
    const model = sequelize.import(modelDir)
    db.models[model.name] = model
  })

  Object.keys(db.models).forEach(key => {
    if ('associate' in db.models[key]) {
      db.models[key].associate(db.models)
    }
  })

  return db
}
