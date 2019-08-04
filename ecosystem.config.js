// ecosystem.config.js
const os = require('os')
module.exports = {
  apps: [{
    port: process.env.ENGINE_PORT,
    name: 'colyseus',
    script: 'src/interfaces/websocket/gameEngine.js', // your entrypoint file
    watch: true, // optional
    instances: os.cpus().length,
    exec_mode: 'fork', // IMPORTANT: do not use cluster mode.
    env: {
      DEBUG: 'colyseus:errors',
      NODE_ENV: 'development'
    }
  }]
}
