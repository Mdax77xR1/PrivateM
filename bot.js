const Discord = require('discord.js');
const client = new Discord.Client();
const developers = ['335484868479811584'];


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  var argresult = message.content.split(` `).slice(1).join(' ');
    if (!developers.includes(message.author.id)) return;

if (message.content.startsWith('Mwt')) {
client.user.setActivity(argresult, {type:'WATCHING'});
  client.user.setStatus("dnd")
    message.channel.send(` <:true:335484868479811584> `)
} else 
if (message.content.startsWith('Mls')) {
client.user.setActivity(argresult , {type:'LISTENING'});
  client.user.setStatus("dnd")
    message.channel.send(`<:true:335484868479811584>`)
  } else 
if (message.content.startsWith('Mpl')) {
client.user.setActivity(argresult , {type:'PLAYING'});
  client.user.setStatus("dnd")
    message.channel.send(`<:true:335484868479811584> `) // حقوق ميرسي.
  }
          
});

client.login(process.env.BOT_TOKEN);
