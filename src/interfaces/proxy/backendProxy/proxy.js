'use strict'
/**
 * This is a hardcoded alternative to using proxies + Colyseus.
 */
var processIdsLocalhost = {
  '0': 'http://127.0.0.1:4000',
  '1': 'http://127.0.0.1:4001',
  '2': 'http://127.0.0.1:4002',
  '3': 'http://127.0.0.1:4003'
}

var ip = '10.253.86.16'

var processIdsNonLocal = {
  '0': `http://${ip}:4000`,
  '1': `http://${ip}:4001`,
  '2': `http://${ip}:4002`,
  '3': `http://${ip}:4003`
}

var proxy = require('redbird')({
  port: Number(process.env.BACKEND_PROXY_PORT),
  resolvers: [function (host, url) {
    var matchedProcessId = url.match(/^\/([a-zA-Z0-9\-]+)\/[a-zA-Z0-9\-]+/)
    if (matchedProcessId && matchedProcessId[1]) {
      return processIdsNonLocal[matchedProcessId[1]]
    }
  }]
})
/**
 * Match-making
 */
/* proxy.register("localhost", "http://127.0.0.1:4000")
proxy.register("localhost", "http://127.0.0.1:4001")
proxy.register("localhost", "http://127.0.0.1:4002")
proxy.register("localhost", "http://127.0.0.1:4003") */

proxy.register(ip, `http://${ip}:4000`)
proxy.register(ip, `http://${ip}:4001`)
proxy.register(ip, `http://${ip}:4002`)
proxy.register(ip, `http://${ip}:4003`)
