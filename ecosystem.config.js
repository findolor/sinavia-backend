require('dotenv-flow').config()

const maxOldSpaceSize = process.env.MAX_OLD_SPACE_SIZE
const maxNewSpaceSize = process.env.MAX_NEW_SPACE_SIZE

module.exports = {
  apps: [
    {
      name: 'backend_app',
      script: 'index.js', // your entrypoint file
      watch: true, // optional
      args: `--max-old-space-size=${maxOldSpaceSize} --max-new-space-size=${maxNewSpaceSize} --nouse-idle-notification --expose-gc`,
      instances: -1,
      exec_mode: 'fork', // Must be fork!!
      env: {
        DEBUG: 'colyseus:errors',
        NODE_ENV: 'local',
        NODE_PATH: '.',
        IS_PROXY_ENABLED: true
      }
    }
  ]
}
