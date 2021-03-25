const cp = require('child_process');
const discord = require('discord.js');
const url = require('url');
const client = new discord.Client();
client.on('message', m => {
  if(m.author.bot);
  if(!m.mentions.has(client.user, { ignoreEveryone: true, ignoreRoles: true})) return;
  const _url = m.content.replace(/(<@!?\d+>\s?)+/,'');
  var host = new url.parse(_url);
  if(!m.content.match(/https?:\/\//)) host = {
    hostname: _url
  };
  const sbp = cp.fork(__dirname + '/get_ip.js');
  sbp.send(host);
  sbp.stdout.on("data", (data) => {
    data = data.toString();
    m.channel.send(data)
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
client.on('ready',() => console.log('ready'))
client.login(process.env.token); //token入れないと死にます
