module.exports = {
  apps: [
    {
      name: 'sinavia_app',
      script: 'index.js', // your entrypoint file
      error_file: './logs/pm2_logs/err.log',
      out_file: './logs/pm2_logs/out.log',
      log_file: './logs/pm2_logs/combined.log',
      time: true,
      instances: 1,
      exec_mode: 'fork', // Must be fork!!
      env: {
        NODE_ENV: process.env.NODE_ENV,
        NODE_PATH: '.'
      }
    }
  ]
}
