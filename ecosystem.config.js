const os = require('os')
module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'index.js',
      instances: os.cpus().length,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'local',
        NODE_PATH: '.'
      }
    },
    {
      name: 'colyseus',
      script: 'startGameEngine.js', // your entrypoint file
      // watch: true, // optional
      instances: os.cpus().length,
      exec_mode: 'fork', // Must be fork!!
      error_file: './logs/pm2/err.log',
      env: {
        DEBUG: 'colyseus:errors',
        NODE_ENV: process.env.NODE_ENV || 'local',
        NODE_PATH: '.'
      }
    }
  ]
}
