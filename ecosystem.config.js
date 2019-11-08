module.exports = {
  apps: [
    {
      name: 'sinavia_app',
      script: 'index.js', // your entrypoint file
      instances: 1,
      exec_mode: 'fork', // Must be fork!!
      env: {
        NODE_ENV: process.env.NODE_ENV,
        NODE_PATH: '.'
      }
    }
  ]
}
