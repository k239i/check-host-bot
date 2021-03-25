const discord = require('discord.js');
const url = require('url');
const client = new discord.Client();
let checked = 0;
client.on('message', m => {
  if(m.author.bot);
  if(!m.mentions.has(client.user, { ignoreEveryone: true, ignoreRoles: true})) return;
  const _url = m.content.replace(/(<@!?\d+>\s?)+/,'');
  var host = new url.parse(_url);
  if(!m.content.match(/https?:\/\//)) host = {
    hostname: _url
  };
  try{
    const _get = getip(host);
    if(_get) message.channel.send(String(_get)+'\n?');
    checked += 1;
  }catch(e){
    message.reply(String(e)+'\n',{code: true});
  };
});
client.on('ready',() => {
  console.log('ready')
  setInterval(() => {
    client.user.setActivity('checked ' + checked + ' hosts.', { type: 'PLAYING' })
    setTimeout(() => {
      client.user.setActivity('@check-host#5362 https://google.com\n@check-host#5362 bing.com', { type: 'PLAYING' })
    },3000);
  },6000);
})
client.login(process.env.token); //token入れないと死にます

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
      return ip;
    }
  )
}
