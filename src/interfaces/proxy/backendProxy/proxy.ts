/**
 * This is a hardcoded alternative to using proxies + Colyseus.
 */
const processIds: {[id: string]: string} = {
    '0': "http://127.0.0.1:4000",
    '1': "http://127.0.0.1:4001",
    '2': "http://127.0.0.1:4002",
    '3': "http://127.0.0.1:4003"
  }
  
  console.log(process.env.BACKEND_PROXY_PORT)

  const proxy = require('redbird')({
    port: Number(process.env.BACKEND_PROXY_PORT),
    resolvers: [function (host: string, url: string) {
      const matchedProcessId = url.match(/^\/([a-zA-Z0-9\-]+)\/[a-zA-Z0-9\-]+/);
      if (matchedProcessId && matchedProcessId[1]) {
        return processIds[matchedProcessId[1]];
      }
    }]
  });
  
  /**
   * Match-making
   */
  proxy.register("localhost", "http://127.0.0.1:4000");
  proxy.register("localhost", "http://127.0.0.1:4001");
  proxy.register("localhost", "http://127.0.0.1:4002");
  proxy.register("localhost", "http://127.0.0.1:4003");
  