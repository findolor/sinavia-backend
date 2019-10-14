const os = require('os')
module.exports = {
  apps: [
    {
      name: 'backend_app',
      script: 'index.js', // your entrypoint file
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
