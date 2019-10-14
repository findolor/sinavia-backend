'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
require('dotenv').config() // load .env file
var discovery_1 = require('./discovery')
var host = process.env.COLYSEUS_PROXY_HOST || 'localhost'
var processIds = {}
var proxy = require('redbird')({
  port: Number(process.env.COLYSEUS_PROXY_PORT),
  resolvers: [function (host, url) {
    var matchedProcessId = url.match(/\/([a-zA-Z0-9\-_]+)\/[a-zA-Z0-9\-_]+\?/)
    if (matchedProcessId && matchedProcessId[1]) {
      return processIds[matchedProcessId[1]]
    }
  }]
})
function register (node) {
  var address = 'http://' + node.address
  processIds[node.processId] = address
  proxy.register(host, address)
}
function unregister (node) {
  var address = processIds[node.processId]
  delete processIds[node.processId]
  proxy.unregister(host, address)
}
// listen for node additions and removals through Redis
discovery_1.listen(function (action, node) {
  if (action === 'add') {
    register(node)
  } else if (action == 'remove') {
    unregister(node)
  }
})
// query pre-existing nodes
discovery_1.getNodeList()
  .then(function (nodes) { return nodes.forEach(function (node) { return register(node) }) })
  .catch(function (err) { return console.error(err) })
