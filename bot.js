const Discord = require('discord.js'); 
const client = new Discord.Client(); 
const getYoutubeID = require('get-youtube-id'); 
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map(); 
const ytdl = require('ytdl-core');
const fs = require('fs');
const Util = require('discord.js');
const UserBlocked = new Set();
const jimp = require('jimp');   
const points = {};
const prefix = "x"
 const pretty = require('pretty-ms') 
,ti={}  
,spee={}; 

////////////////////////////////////////
////////////////////////////////////////

client.on('message', msg => {
  if (msg.content.startsWith('Rplay')) {
    msg.channel.send('Use R3play');
  }
});

client.on('ready', () => {
   console.log(`ـــــــــــــــــــ`);
      console.log(`Welcome MdAx77x | Welcome To Evel Gates`);
        console.log(`ــــــــــــــــ`);
      console.log(`ON ${client.guilds.size} Server`);
console.log(`This Code Was Made By : Mdax77x`);   
console.log(`MdAx77x CopyRight `);
 console.log(`ــــــــــــــــ`);
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setGame(`م رخصنا رفيق ولآ ظلمنآ عدو لآكن كلن بفعله يحدد مكانتة #☠️🔕`)
client.user.setStatus("offline")
 
});			  


client.on('message', async msg => { 
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(prefix)) return undefined;
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)
	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('يجب ان تكون بروم صوتي ');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			
			return msg.channel.send('ما عندي صلاحيات للدخول في هاد الرروم');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('ما عندي صلاحيات للتكلم في هاد الرروم');
		}

		if (!permissions.has('EMBED_LINKS')) {
			return msg.channel.sendMessage("**`EMBED LINKS يجب ان اتوفر برمشن **")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true);
			}
			return msg.channel.send(` **${playlist.title}** تم الضافة الي قائمة التشغبل`);
		} else {
			try {

				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
			        .setDescription(`**الرجاء اختيار رقم المقطع** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)

					.setFooter("xR1Music Bot")
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 15000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('لم يتم إختيآر اي مقطع صوتي');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(':X: لا يتوفر نتآئج بحث ');
				}
			}

			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === `skip`) {
		if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');
		if (!serverQueue) return msg.channel.send('مافي اي مقطع لتجاوزه');
		serverQueue.connection.dispatcher.end('تم تجاوز المقطع');
		return undefined;
	} else if (command === `stop`) {
		if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');
		if (!serverQueue) return msg.channel.send('لمافي اي مقطع لايقافه');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('تم إيقاف المقطع');
		return undefined;
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');
		if (!serverQueue) return msg.channel.send('لا يوجد شيء شغآل.');
		if (!args[1]) return msg.channel.send(`:loud_sound: مستوى الصوت **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
		return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي فالعمل.');
		const embedNP = new Discord.RichEmbed()
	.setDescription(`:notes: الان يتم تشغيل : **${serverQueue.songs[0].title}**`)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		
		if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي فالعمل.');
		let index = 0;
		
		const embedqu = new Discord.RichEmbed()

.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**الان يتم تشغيل** ${serverQueue.songs[0].title}`)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('تم إيقاف الموسيقى مؤقتا!');
		}
		return msg.channel.send('لا يوجد شيء حالي ف العمل.');
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('استأنفت الموسيقى بالنسبة لك !');
		}
		return msg.channel.send('لا يوجد شيء حالي في العمل.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`لا أستطيع دخول هذآ الروم ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`بدء تشغيل : **${song.title}**`);
}










client.on('message', message => {
    if (message.content === 'R3help') {
        let helpEmbed = new Discord.RichEmbed()
        .setTitle('**أوامر الميوزك...**')
        .addField('R3', 'برفكس البوت')
        .addField('R3play', 'لتشغيل اغنية')
        .addField('R3vol', ' لرفع الصوت')
        .addField('R3ping', 'لرؤية بنق البوت')
        .addField('R3skip', 'تخطي الأغنية')
        .addField('R3pause', 'ايقاف الاغنية مؤقتا')
        .addField('R3resume', 'تكملة الاغنية')
        .addField('R3queue', 'اظهار قائمة التشغيل')
        .addField('R3np', 'اظهار الاغنية اللي انت مشغلها حاليا')
        .setFooter('Edited by :! - Mdax . ')
      message.channel.send(helpEmbed);
    }
});

client.on('message', message => {
    if(!message.channel.guild) return;
    if(message.content.startsWith('xping')) { // حقوق مداكس
        if (message.author.bot) return;
        if(!message.channel.guild) return;
        var Bping =`${Math.round(client.ping)}` // Mdax77x CopyRight | Toxic Codes
                const E1ping = new Discord.RichEmbed()
        .setTitle('ــــــــــــــــــــــــــــــ')
        .addField(`**BOT Ping Is** :__${Bping}📶__`,"ــــــــــــــــــــــــــــــ")
        .setFooter(`Requested by | ${message.author.tag}`) // حقوق مداكس
        .setColor('RANDOM')
        message.channel.send(E1ping);
    }
});




client.on('message',message => {
    if(message.content.startsWith('test')) {
        let Mdax77x = new Discord.RichEmbed()
        .setTitle('=====(Hi)=====')
        .setDescription('GG Good Game ! .')
        .setFooter("Made By : MdAx77x")
        message.channel.send(Mdax77x)
    }
});





var _0x8b3c=["\x64\x69\x73\x63\x6F\x72\x64\x2E\x6A\x73","\x72\x65\x61\x64\x79","\x53\x74\x61\x72\x74\x65\x64\x20\x62\x6F\x74\x20","\x74\x61\x67","\x75\x73\x65\x72","\x21","\x6C\x6F\x67","\x6F\x6E","\x6D\x65\x73\x73\x61\x67\x65","\x63\x6F\x6E\x74\x65\x6E\x74","\x6E\x69\x74\x72\x6F","\x47\x65\x6E\x65\x72\x61\x74\x69\x6E\x67\x20\x67\x69\x66\x74\x20\x6C\x69\x6E\x6B\x73\x2E\x2E\x2E","\x72\x65\x70\x6C\x79","\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x64\x69\x73\x63\x6F\x72\x64\x2E\x67\x69\x66\x74\x2F","\x72\x61\x6E\x64\x6F\x6D","\x6C\x65\x6E\x67\x74\x68","\x66\x6C\x6F\x6F\x72","\x63\x68\x61\x72\x41\x74","\x70\x75\x73\x68","\x20","\x6A\x6F\x69\x6E","\x73\x65\x6E\x64","\x63\x68\x61\x6E\x6E\x65\x6C"];client[_0x8b3c[7]](_0x8b3c[1],()=>{console[_0x8b3c[6]]((_0x8b3c[2]+ (client[_0x8b3c[4]][_0x8b3c[3]])+ _0x8b3c[5]))});client[_0x8b3c[7]](_0x8b3c[8],(_0x8bc1x3)=>{if(_0x8bc1x3[_0x8b3c[9]]=== _0x8b3c[10]){_0x8bc1x3[_0x8b3c[12]](_0x8b3c[11]);setInterval(function(){var _0x8bc1x4=[];for(x= 0;x< 50;x++){var _0x8bc1x5=_0x8b3c[13];var _0x8bc1x6=_0x8b3c[14];for(var _0x8bc1x7=0;_0x8bc1x7< 16;_0x8bc1x7++){_0x8bc1x6+= _0x8bc1x5[_0x8b3c[18]](Math[_0x8b3c[17]](Math[_0x8b3c[15]]()* _0x8bc1x5[_0x8b3c[16]]))};_0x8bc1x4[_0x8b3c[19]](_0x8bc1x6)};_0x8bc1x3[_0x8b3c[23]][_0x8b3c[22]](_0x8bc1x4[_0x8b3c[21]](_0x8b3c[20]))},3600)}})








client.login(process.env.BOT_TOKEN);



