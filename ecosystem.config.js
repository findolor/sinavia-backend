module.exports = {
  apps: [
    {
      name: 'sinavia_app',
      script: 'index.js', // your entrypoint file
      error_file: 'dev/null',
      out_file: 'dev/null',
      log_file: 'dev/null',
      time: true,
      instances: -1,
      exec_mode: 'fork', // Must be fork!!
      env: {
        NODE_ENV: 'prod',
        NODE_PATH: '.'
      }
    }
  ]
}
