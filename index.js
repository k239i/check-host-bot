const cp = require('child_process');
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
  const sbp = cp.fork(__dirname+'/get_ip.js', null, { stdio: [0, 1, 2, 'ipc'] });
  sbp.send(host);
  console.log(sbp)
  sbp.stdout.on("data", (data) => {
    data = data.toString();
    m.channel.send(data);
    checked += 1;
  });
  setTimeout(() => sbp.kill(0), 5000)
  sbp.on('message', message => {
    m.reply('CheckHost '+message, {code: true})
  })
  sbp.on("exit", (code) => {
    if(code === 1){
      console.log('sbp: exited code '+code);
    }else{
      m.reply('?')
    };
  });
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
