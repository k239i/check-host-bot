const http = require('http');
function getip(host){
  http.get({
    hostname: host.hostname,
    port: host.port,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
    }
  },
    function(res){
      var ip = res.socket.remoteAddress;
      console.log(ip)
    }
  )
}
process.on('message', message => {
  getip(message);
})

process.on('uncaughtException', error => {
  process.send(error)
  process.exit(114514810931931)
})
