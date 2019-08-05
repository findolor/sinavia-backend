// ecosystem.config.js

module.exports = {
  apps: [{
    port: process.env.ENGINE_PORT,
    name: 'colyseus',
    script: 'src/interfaces/websocket/gameEngine.js', // your entrypoint file
    watch: true, // optional
    instances: process.env.WEB_CONCURRENCY,
    exec_mode: 'fork', // IMPORTANT: do not use cluster mode.
    env: {
      DEBUG: 'colyseus:errors',
      NODE_ENV: process.env.NODE_ENV
    }
  }]
}
