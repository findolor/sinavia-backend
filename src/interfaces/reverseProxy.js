const express = require('express')
const httpProxy = require('http-proxy')
const apiProxy = httpProxy.createProxyServer()

module.exports = ({ config }) => {
  const app = express()

  const apiServer = config.apiUrl + config.port

  // We start a reverse proxy server for our api server
  // It runs on the same server as the game engine
  // If the request has the prefix /api, proxy server redirects it to our api server
  // If it doesn't have anything, it means that it is for our engine

  return {
    startReverseProxy: () => new Promise((resolve) => {
      app.all('/api/*', (req, res) => {
        apiProxy.web(req, res, { target: apiServer })
      })

      resolve(app)
    })
  }
}
