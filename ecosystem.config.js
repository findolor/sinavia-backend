const os = require('os')
module.exports = {
  apps: [
    // Backend app
    {
      port: 4000,
      name: 'backend_app',
      script: 'index.js', // your entrypoint file
      watch: true, // optional
      instances: os.cpus().length,
      exec_mode: 'cluster',
      env: {
        DEBUG: 'colyseus:errors',
        NODE_ENV: 'local',
        NODE_PATH: '.'
      }
    },
    // Colyseus app
    {
      port: 5000,
      name: 'colyseus_app',
      script: 'src/interfaces/websocket/gameEngine.js', // your entrypoint file
      watch: true, // optional
      instances: os.cpus().length,
      exec_mode: 'fork', // IMPORTANT: do not use cluster mode.
      env: {
        DEBUG: 'colyseus:errors',
        NODE_ENV: 'local',
        NODE_PATH: '.'
      }
    }
  ]
}
