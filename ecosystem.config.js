const os = require('os')
module.exports = {
  apps: [
    /* {
      name: 'backend',
      script: 'startBackend.js', // your entrypoint file
      watch: true, // optional
      instances: os.cpus().length,
      exec_mode: 'fork', // Must be fork!!
      env: {
        DEBUG: 'colyseus:errors',
        NODE_ENV: 'local',
        NODE_PATH: '.'
      }
    }, */
    {
      port: 8080,
      name: 'game_engine',
      script: 'startGameEngine.js', // your entrypoint file
      watch: true, // optional
      instances: os.cpus().length,
      exec_mode: 'fork', // Must be fork!!
      env: {
        DEBUG: 'colyseus:errors',
        NODE_ENV: 'local',
        NODE_PATH: '.'
      }
    }
  ]
}
