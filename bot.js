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


var prefix = "x"
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




client.on("message", async message => {
    var AlphaCodesGame =[
        {q:"**'ما أسم السيرفر الذي يسرق أكواد'**",a:"Alpha Codes"},
        {q:"**`من هو سيرفر الأطفال `**",a:"Alpha Codes"},
        {q:"**`ما اسم سيرفر المبرمجين الحقيقين`**",a:"Toxic Codes"},
        {q:"**`ما أسم أفشل سيرفر شهده الديسكورد `**",a:"Alpha Codes"},
        {q:"**`ماأسم السيرفر الذي تم فضحه`**",a:"Alpha Codes"},
        {q:"**`لماذا سيرفر  الفا كودز يسرقون اكواد توكسك كودس ؟`**",a:"لأنهم أطفال"},
        {q:"**`ما أسم سيرفر الجبناء + الحرامية الذين لايستطيعون  مواجهة توكسك كودس و الوادع`**",a:"Alpha Codes"},
        {q:"**`ماأسم الاونر الجبان الذي لم يستطع مواجهة توكسك كودس ؟`**",a:"YATO"},
        {q:"**`ماأسم السيرفر ألذي طرد اونر توكسك كودس خوفا منه`**",a:"Alpha Codes"},
        {q:"*`من صنع هذا الكود الرهيب`**",a:"Mdax77x"},    
    

    ];
        if(message.content == prefix+"Alpha"){
            if(UserBlocked.has(message.guild.id)) return message.channel.send("أنتظر قليلاً .")
            UserBlocked.add(message.guild.id)
            var Mdax77x = AlphaCodesGame[Math.floor(Math.random() * AlphaCodesGame.length)];
            let E2MdĄx7ź = new Discord.RichEmbed()
            .setTitle('Alpha Codes Game')
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor("RANDOM")
            .setDescription(Mdax77x.q);
            setFooter("This Code Was Edited By : ✈ MdĄx7ź ♛ .#4836 ")
            message.channel.sendEmbed(embed).then(msg=> msg.delete(20000))
            const msgs = await message.channel.awaitMessages(msg => msg.author.id !== client.user.id ,{maxMatches:1,time:10000});
            UserBlocked.delete(message.guild.id)
            msgs.forEach(result => {
               if(result.author.id == client.user.id) return;
               if(result.content == "xAlpha") return
               if(result.content == Mdax77x.a){
                 let E3MdĄx7ź = new Discord.RichEmbed()
                 .setTitle('=====(Error404)=====')
                 .setTitle(':white_check_mark: اجابة صحيحة')
                 .setColor("RANDOM")
                 .setFooter(`Requested By | ${message.author.tag}`) // Mdax77x | Toxic Codes
                 .addField('==================',true)

                 message.channel.sendEmbed(E3MdĄx7ź);                return;
               } else {
     
                                      var E4MdĄx7ź = new Discord.RichEmbed()
                    .setTitle('=====(Error404)=====')
                    .setTitle(':x:الإجابة خاطئة')
                    .setColor("RANDOM")
                    .setFooter(`Requested By | ${message.author.tag}`) // Mdax77x | Toxic Codes
                    .addField('==================',true)
                    message.channel.sendEmbed(E4MdĄx7ź);
               }
         });
      }
    });





client.login(process.env.BOT_TOKEN);



