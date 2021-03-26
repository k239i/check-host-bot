const discord = require('discord.js');
const url = require('url');
const client = new discord.Client();
let checked = 0;
client.on('message', async m => {
  const message = m;
  if(m.author.bot) return;
  if(!m.mentions.has(client.user, { ignoreEveryone: true, ignoreRoles: true})) return;
  var chal = !!(m.content.match('-ch_al'));
  var chpi = !!(m.content.match('-ch_pi'));
  var _url = m.content.replace(/(<@!?\d+>\s?(\s?-ch_al\s?|\s?-ch_pi\s?)+?(\s+)?)/,'');
  var host = new url.parse(_url);
  if(!m.content.match(/https?:\/\//)){
    var vaa = _url.split(':');
    if(vaa[1]){
      host = {
        hostname: vaa[0],
        port: Number(vaa[1])
      }
    }else{
      host = {
        hostname: _url
      }
    }
  };
  try{
    let _get;
    console.log(JSON.stringify([chal,host,_url],null,2))
    if(chpi){
      alivecheck(host).catch(e => {
        throw e;
      });
      _get = await ping(host);
    }else{
      _get = await getip2(host);
    };
    if(chal){
      _get = await alivecheck(host);
    }else{
      _get = await getip2(host);
    };
    console.log(_get)
    reply(m, String(_get) ,true);
    checked += 1;
  }catch(e){
    reply(m, String(e) ,true);
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
function alivecheck(host){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('The site is dead...(timeout)');
    },3000);
    try{
      http.get({
        timeout: 3000,
        hostname: host.hostname,
        port: host.port,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
        }
      },
        function(res){
        if(res.statusCode >= 500 && res.statusCode <= 599) return resolve('The site is dead...\n');
          resolve('The site is still alive...\n')
        }).on('error', er => {
         if(er.code === 'ETIMEDOUT') resolve('The site is dead...\n')
          else reject(er);
        });
    }catch(e){
      reject(e);
    };
  })
};
function getip2(host){
  const dns = require('dns');
  return new Promise((resolve,reject) => {
    dns.lookup(host.hostname, function(er,address){
      if(er) return reject(er);
      if(!address) reject('?');
      resolve(address);
    })
  })
};
function ping(host){
  let ahokusa = 0;
  return new Promise((resolve, reject) => {
    setInterval(() => {
      ahokusa += 1;
    });
    setTimeout(() => {
      reject('timeouted! ' + ahokusa + 'ms');
    },10 * 1000);
    try{
      http.get({
        hostname: host.hostname,
        port: host.port,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
        }
      },
        function(res){
        if(res.statusCode >= 500 && res.statusCode <= 599) return resolve(':thinking: 503');
          resolve('pong! '+ahokusa+'ms')
        }).on('error', er => {
         if(er.code === 'ETIMEDOUT') resolve('pong! '+ahokusa+'ms')
          else reject(er);
        });
    }catch(e){
      reject(e);
    };
  })
};
function reply(basemsg, message, send_mention, embed) {
    const fetch = require("node-fetch");
    const msgJson = {
        "content": message,
        "embed": embed,
        "message_reference": {
            "message_id": basemsg.id
        },
        "allowed_mentions": {
            "replied_user": send_mention
        }
    };
    fetch(`https://discord.com/api/channels/${basemsg.channel.id}/messages`, {
        method: "post",
        body: JSON.stringify(msgJson),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${process.env.token}`
        }
    });
};
