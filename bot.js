const botSettings = require("./config.json"); // تم تتطوير البوت من الصفر By : xR1
const Discord = require("discord.js");
const axios = require("axios");
const yt = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const fs = require("fs");
const getYTID = require("get-youtube-id");
const path = require('path');
const version = 'v1.0'; // تحديث بوتك
const fetchVideoInfo = require("youtube-info");
const initcmd = botSettings.initcmd;
const ytApiKey = botSettings.AIzaSyDXsAT7Bi-uY07llBlXkBEj_xHTEvZdnm4;
const youtube = new YouTube(AIzaSyDXsAT7Bi-uY07llBlXkBEj_xHTEvZdnm4);
const botxR1= ['335484868479811584']; // الايدي بتاعك انتا ووالادارة
// By : xR1. || 
const bot = new Discord.Client({
	disableEveryone: true
});
// By : xR1. || 
/* متغيرات الموسيقى */
let queue = []; // قائمة الاغاني المنتظره
let songsQueue = []; // أسماء الأغاني المخزنة لأمر قائمة الانتظار
let isPlaying = false; // تلعب الموسيقى
let dispatcher = null;
let voiceChannel = null;
let skipRequest = 0; // يخزن عدد طلبات التخطي
let skippers = []; // أسماء المستخدمين الذين صوتوا لتخطي الأغنية
let ytResultList = []; // نتائج أسماء الفيديو من أمر yt
let ytResultAdd = []; // لتخزين خيار الأمر .add
/* نهاية متغيرات الموسيقي */
let re = /^(?:[1-5]|0[1-5]|10)$/; // ريجليكس للسماح فقط 1-5 أثناء اختيار أغنية من نتائج يوتيوب
let regVol = /^(?:([1][0-9][0-9])|200|([1-9][0-9])|([0-9]))$/; // ريجليكس للتحكم بالصوت
let youtubeSearched = false; // اذا تم البحث في اليوتيوب (امر .add)
let selectUser; // خاص بامر userinfo , لما تعمل منش لشخص اخر
// By : xR1. || 
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    console.log(`in ${bot.guilds.size} servers `)
    console.log(`[xR1] ${bot.users.size}`)
    bot.user.setStatus("idle")
// By : xR1. || 
});// By : xR1. || 
// By : xR1. || 
bot.on('message', message => {
    if (message.content === initcmd + "SettingsDj") {
    if (!botxR1.includes(message.author.id)) return;
    if(!message.channel.guild) return message.channel.send('**هذا الامـر للسيرفرات فقط ## !**')
            if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(`**${message.author.username} You Dont Have** ``MANAGE_ROLES`` **Premission**`);
            // By : xR1. || 
                     message.guild.createRole({ name: "Dj", color: "150432", permissions: [335019120] })
// By : xR1. || 
					message.channel.send({embed: {
                    color: 3447003,
                    description: ":no_entry: || **__جاري ضبط اعدادات``Dj``__**"
                    }});
}// By : xR1. || 
});
// By : xR1. || 

// By : xR1. || 

bot.on('ready', () => {
	// -
  bot.user.setActivity("Stockholm xR1 <3",{type: 'WATCHING'});
  console.log('            ╔[════════════]╗');
  console.log('              Bot Is Online');
  console.log('            ╚[════════════]╝');
  console.log('xR1_music.')
});


bot.on("message", async message => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
// By : xR1. || 
	let messageContent = message.content.split(" ");
	let command = messageContent[0];
	let args = messageContent.slice(1);
// By : xR1. || 
	if (!command.startsWith(initcmd)) return;
// By : xR1. || 
	switch (command.slice(1).toLowerCase()) {
// By : xR1. || 
		case "play":
			if (args.length == 0 && queue.length > 0) {
				if (!message.member.voiceChannel) {// By : xR1. || 
					message.reply("Erorr 😭 ");
					message.channel.send({embed: {// By : xR1. || 
                    color: 3447003,
                    description: ":no_entry: || **__يجب ان تكون في روم صوتي__**"
                    }});
				} else {// By : xR1. || 
					isPlaying = true;
					playMusic(queue[0], message);
					message.channel.send({embed: {// By : xR1. || 
                    color: 3447003,
                    description: "**تم بدء تشغيل الاغنية.  : **" + songsQueue[0],
                    }});// By : xR1. || 
				}
			} else if (args.length == 0 && queue.length == 0) {
				message.reply("قائمة التشغيل فارغة الآن , .play [ واسم الاغنية ] or .yt [ ومصطلح البحث ] || لتشغيل والبحث عن الاغاني");
			} else if (queue.length > 0 || isPlaying) {
				getID(args).then(id => {
					if (id) {// By : xR1. || 
						queue.push(id);
						getYouTubeResultsId(args, 1).then(ytResults => {
                             message.reply(" ");
                             const embed = new Discord.RichEmbed()
                             .setColor("36393f")// By : xR1. || 
                             .addField('📝 ** || اغنية جديدة في قائمة التشغيل**', '**'+[ytResults]+'**')
                             .addField(`✨** بواسطة **:`, '**'+[message.author.username]+'**')
                             .setTimestamp()
                             .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                             .addField('**``اقتراحنا لك.``👍👌**' , "**"+sugg[Math.floor(Math.random() * sugg.length)]+"**", true)
                             .addField('**``سرعة استجابة البوت``🍃**', "``"+[Date.now() - message.createdTimestamp]+'``Ms📶', true)
                             .setThumbnail(`http://simpleicon.com/wp-content/uploads/playlist.png`)
                              message.channel.send({embed});
							songsQueue.push(ytResults[0]);// By : xR1. || 
						}).catch(error => console.log(error));
					} else {
						message.reply(" ");// By : xR1. || 
						message.channel.send({embed: {
						color: 3447003,
						description: "🐸 || **__اسف لا يمكن العثور علي الاغنية__**"
						}});// By : xR1. || 

					}// By : xR1. || 
				}).catch(error => console.log(error));
			} else {
				isPlaying = true;// By : xR1. || 
				getID(args).then(id => {
					if (id) {// By : xR1. || 
						queue.push(id);
						playMusic(id, message);// By : xR1. || 
						getYouTubeResultsId(args, 1).then(ytResults => {
                             message.reply(" ");
                             const embed = new Discord.RichEmbed()
                             .setColor("36393f")
                             .addField('** ☑ || تم تشغيل** ', '**'+[ytResults]+'**')
                             .addField(`✨** بواسطة **:`, '**'+[message.author.username]+'**')
                             .setTimestamp()// By : xR1. || 
                             .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                             .addField('**``اقتراحنا لك.``👍👌**' , "**"+sugg[Math.floor(Math.random() * sugg.length)]+"**", true)
                             .addField('**``سرعة استجابة البوت``🍃**', "``"+[Date.now() - message.createdTimestamp]+'``Ms📶', true)
                             .setThumbnail(`http://i.ytimg.com/vi/${queue}/hqdefault.jpg`)
                              message.channel.send({embed});// By : xR1. || 

                  songsQueue.push(ytResults[0]);
						}).catch(error => console.log(error));
					} else {// By : xR1. || 
						message.reply(" ");// By : xR1. || 
						message.channel.send({embed: {
						color: 3447003,
						description: "🐸 || **__اسف لا يمكن العثور علي الاغنية__**"
						}});

					}// By : xR1. || 
				}).catch(error => console.log(error));
			}// By : xR1. || 
			break;

		case "skip":
			console.log(queue);
			if (queue.length === 1) {// By : xR1. || 
				message.reply(" ");
				message.channel.send({embed: {
				color: 3447003,// By : xR1. || 
				description: " ⁉ || **__قائمة التشغيل فارغة الان , اكتب .play [اسم الاغنية] او .yt [اسم الاغنية]__**"
				}});// By : xR1. || 
				dispatcher.end();
			} else {
				if (skippers.indexOf(message.author.id) === -1) {
					skippers.push(message.author.id);
					skipRequest++;

					if (skipRequest >= Math.ceil((voiceChannel.members.size - 1) / 2)) {
						skipSong(message);
                             message.reply(" ");// By : xR1. || 
                             const embed = new Discord.RichEmbed()
                          .setColor("36393f")// By : xR1. || 
                         .addField('** ⏯ || الاغنية الحالية ** ', '**'+[songsQueue]+'**')
                       .addField(`✨** تم التخطي بواسطة **:`, '**'+[message.author.username]+'**')
                      .setTimestamp()// By : xR1. || 
                     .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                     .addField('**``لضبط الصوت.``👍👌**' , "**"+".vol [ 0 - 200 ] لضبط اعدادات الصوت"+"**", true)
                     .addField('**``سرعة استجابة البوت``🍃**', "``"+[Date.now() - message.createdTimestamp]+'``Ms📶', true)
                     .setThumbnail(`http://i.ytimg.com/vi/${queue}/hqdefault.jpg`)
                              message.channel.send({embed});
					} else {// By : xR1. || 
						message.reply(` `);
						message.channel.send({embed: {
				color: 3447003,// By : xR1. || 
				description: " #⃣ || ** لقد تم اضاف تصويتك ,  تحتاج الـ"+"__"+[Math.ceil((voiceChannel.members.size - 1) / 2) - skipRequest]+"__"+"اكتر من تصويت , لتخطي الاغنية الحالية**"
				}});
					}
				} else {// By : xR1. || 
						message.reply(` `);
						message.channel.send({embed: {
				color: 3447003,
				description: " 😒 || **__لقد قمت بالتوصيت بالفعل__**"
				}});
				}
			}
			break;// By : xR1. || 

		case "playlist":
			if (queue.length === 0) { // اذا لم تكن هناك اغاني في قائمة التشغيل , ف يبعت رسالة ان قائمة الشتغيل
						message.reply(` `);
						message.channel.send({embed: {
				color: 3447003,
				description: " 😒 || **__قائمة التشغيل فارغة , ``اكتب : .play | .yt`` للبحث علي الاغاني__**"
				}});
			} else if (args.length > 0 && args[0] == 'remove') {
				        let xR1 = message.guild.member(message.author).roles.find('name', 'Dj');
				if (args.length == 2 && args[1] <= queue.length) {

						message.reply(` `);
                             const embed = new Discord.RichEmbed()
                          .setColor("36393f")
                         .addField('** 🗑 ||: تمت ازالتة من قائمة التشغيل : ** ',''+songsQueue[args[1] - 1]+'')
                       .addField(`✨** تمت الازالة بواسطة : **:`, '**'+[message.author.username]+'**')
                      .setTimestamp()
                     .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                     message.channel.send({embed});
					queue.splice(args[1] - 1, 1);
					songsQueue.splice(args[1] - 1, 1);
				} else {// By : xR1. || 
					message.reply(` `);
					message.channel.send({embed: {
					color: 3447003,
					description: ` 📝 || **__يجب وضع رقم الاغنية فـ قائمة التشغيل.__**`
				}});// By : xR1. || 
				}
			} else if (args.length > 0 && args[0] == 'clear') {
				        let xR1 = message.guild.member(message.author).roles.find('name', 'Dj');
				if (args.length == 1) {
// By : xR1. || 
						message.reply(` `);
                             const embed = new Discord.RichEmbed()
                          .setColor("36393f")
                         .setDescription('**تمت ازالة جميع الموسيقي الموجوده فـ قائمة الشتغيل , استمتع 😉**')
                      .setTimestamp()// By : xR1. || 
                     .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                     message.channel.send({embed});
					queue.splice(1);// By : xR1. || 
					songsQueue.splice(1);
				} else {// By : xR1. || 
						message.reply(` `);
                             const embed = new Discord.RichEmbed()
                          .setColor("36393f")
                         .setDescription('**انتا تحتاج الي كتابة .playlist clear دون اتباع الحجج**')
                      .setTimestamp()// By : xR1. || 
                     .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                     message.channel.send({embed});
				}// By : xR1. || 
			} else if (args.length > 0 && args[0] == 'shuffle') {
				        let xR1 = message.guild.member(message.author).roles.find('name', 'Dj');
				let tempA = [songsQueue[0]];
				let tempB = songsQueue.slice(1);// By : xR1. || 
				songsQueue = tempA.concat(shuffle(tempB));
						message.reply(` `);// By : xR1. || 
                             const embed = new Discord.RichEmbed()
                          .setColor("36393f")// By : xR1. || 
                         .setDescription('**تـم تبديل قائمة التشغيل اكتب .playlist لمشاهدة قائمة الشتغيل الجديده**')
                      .setTimestamp()
                     .setFooter(bot.user.username+" ||", bot.user.avatarURL)// By : xR1. || 
                     message.channel.send({embed});
			} else {// لو فـ اغاني ف قائمة التشغيل , ف الصف ده خاص بيها
				let format = "```"// By : xR1. || 
				for (const songName in songsQueue) {
					if (songsQueue.hasOwnProperty(songName)) {
						let temp = `${parseInt(songName) + 1}: ${songsQueue[songName]} ${songName == 0 ? "**(PlayingNow - تعمل الان.)**" : ""}\n`;
						if ((format + temp).length <= 2000 - 3) {
							format += temp;
						} else {
							format += "```";
							message.channel.send(format);
							format = "```";
						}// By : xR1. || 
					}
				}
				format += "```";
				message.channel.send(format);// By : xR1. || 
			}
			break;
// By : xR1. || 
		case "repeat":// By : xR1. || 
			if (isPlaying) {
				queue.splice(1, 0, queue[0]);
				songsQueue.splice(1, 0, songsQueue[0]);
						message.reply(` `);
                             const embed = new Discord.RichEmbed()
                          .setColor("36393f")// By : xR1. || 
                         .setDescription(`🔁 **${songsQueue[0]} سوف يتم تكرار الاغنية`)
                      .setTimestamp()
                     .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                     message.channel.send({embed});

			}
			break;

		case "stop":
        let xR1 = message.guild.member(message.author).roles.find('name', 'Dj');
                if(!xR1) return message.reply('** لايمكنك ايقاف البوت يجب عليك الحصول علي رتبت ``Dj``**')
        message.reply(" ");
                const embed = new Discord.RichEmbed()
                .setColor("36393f")
                .setDescription('⏹ || **سوف يتم اغلاق البوت بعد 5 ثواني**')
                .setTimestamp()
                .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                message.channel.send({embed});
			dispatcher.end();
			setTimeout(() => voiceChannel.leave(), 4000)
			break;

		case "yt":
			if (args.length == 0) {// By : xR1. || 
				message.reply(` `);
				message.channel.send({embed: {
				color: 3447003,
				description: " 📝 || **__يجب عليك ادخال : .yt [ مصطلح البحث باليوتيوب]__**"
			}});

			} else {
				message.channel.send("```يبحث باليوتيوب...```");
				getYouTubeResultsId(args, 5).then(ytResults => {
					ytResultAdd = ytResults;
					let ytEmbed = new Discord.RichEmbed()
						.setColor("36393f")
						.setAuthor("Youtube search results: ", icon_url = "https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png")
						.addField("1:", "```" + ytResults[0] + "```")
						.addField("2:", "```" + ytResults[1] + "```")
						.addField("3:", "```" + ytResults[2] + "```")
						.addField("4:", "```" + ytResults[3] + "```")
						.addField("5:", "```" + ytResults[4] + "```")
						.addBlankField()
						.setFooter("شرح الاستخدام : .add [قم بوضع رقم البحث] ");
					message.channel.send(ytEmbed);
					youtubeSearched = true;
				}).catch(err => console.log(err));
			}
			break;

		case "add":// By : xR1. || 
			if (youtubeSearched === true) {
				if (!re.test(args)) {// By : xR1. || 
                const embed = new Discord.RichEmbed()
                .setColor("36393f")// By : xR1. || 
                .setDescription('🤦 || ** لقد قمت بادخال الرقم بطريقة خاطئة , يرجي ادخال 1-5 لترتيب قائمة الاغاني')
                .setTimestamp()
                .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                message.channel.send({embed});
				} else {
					let choice = ytResultAdd[args - 1];
					getID(choice).then(id => {
						if (id) {// By : xR1. || 
							queue.push(id);
							getYouTubeResultsId(choice, 1).then(ytResults => {
                message.reply(` `);
                const embed = new Discord.RichEmbed()
                .setColor("36393f")// By : xR1. || 
                .setDescription('**تم اضافة الي قائمة التشغيل'+'``'+ytResults+'``'+'**')
                .setTimestamp()// By : xR1. || 
                .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                message.channel.send({embed});
// By : xR1. || 
								songsQueue.push(ytResults[0]);
							}).catch(error => console.log(error));// By : xR1. || 
						}
					}).catch(error => console.log(error));
					youtubeSearched = false;
				}
			} else {// By : xR1. || 
                message.reply(` `);
                const embed = new Discord.RichEmbed()
                .setColor("36393f")// By : xR1. || 
                .setDescription(`** تحتاج إلى استخدام .yt [search term - مصطلح البحث ] , .add لـختيار اغنية من علامات البحث من قائمة التشغيل. **`)
                .setTimestamp()// By : xR1. || 
                .setFooter(bot.user.username+" ||", bot.user.avatarURL)
                message.channel.send({embed});
			}
			break;
		case "vol":
			if (args.length == 0 && dispatcher) {
				message.reply(` `);
                const embed = new Discord.RichEmbed()
                .setColor("36393f")// By : xR1. || 
                .setDescription(`** Volume - حجم الصوت الحالي  [ __${dispatcher.volume}__ ]**`)
                message.channel.send({embed});
			} else if (args.length > 0 && regVol.test(args) == true && dispatcher) {
				dispatcher.setVolume(args * 0.01);
				message.reply(` `);
                const embed = new Discord.RichEmbed()
                .setColor("36393f")// By : xR1. || 
                .setDescription(`** تم تعيين حجم الموسيقى إلى [ __${args}__% ]**`)
                message.channel.send({embed});
				console.log('متسوي الصوت الجديد ='+dispatcher.volume);
			} else if (!regVol.test(args) && dispatcher) {
				message.reply(" ");
                const embed = new Discord.RichEmbed()
                .setColor("36393f")// By : xR1. || 
                .setDescription(`**خطأ : انتا تحتاج الي ادخال من 0 - 200 لاختيار حجم الموسيقي**`)
                message.channel.send({embed});
			} else {
				message.reply(" ");
                const embed = new Discord.RichEmbed()
                .setColor("36393f")// By : xR1. || 
                .setDescription(`**خطأ : لا يمكنك تعين الصوت اذا لم تكون هناك موسيقي تعمل**`)
                message.channel.send({embed});
			}
			break;// By : xR1. || 

	}
});// By : xR1. || 

/*--------------------------------*/
/* MUSIC CONTROL FUNCTIONS START */
/*------------------------------*/
function playMusic(id, message) {// By : xR1. || 
	voiceChannel = message.member.voiceChannel;

	voiceChannel.join()// By : xR1. || 
		.then(connection => {
					message.channel.send({embed: {// By : xR1. || 
                    color: 3447003,
                    description: "**الان تعمل اغنية : **" + songsQueue[0],
                    }});// By : xR1. || 
			console.log('الان تعمل اغنية : ' + songsQueue[0])
			stream = yt(`https://www.youtube.com/watch?v=${id}`, {
				filter: 'audioonly'
			})
// By : xR1. || 
			skipRequest = 0;
			skippers = [];

			dispatcher = connection.playStream(stream);
			dispatcher.setVolume(0.50);
			dispatcher.on('end', () => {
				skipRequest = 0;
				skippers = [];
				queue.shift();// By : xR1. || 
				songsQueue.shift();
				if (queue.length === 0) {
					console.log("Disconnected...");
					queue = [];
					songsQueue = [];// By : xR1. || 
					isPlaying = false;
				} else {// By : xR1. || 
					setTimeout(() => playMusic(queue[0], message), 500);
				}
			});// By : xR1. || 
		})
		.catch(error => console.log(error));
}
// By : xR1. || 
async function getID(str) {
	if (str.indexOf("youtube.com") > -1) {
		return getYTID(str);
	} else {
		let body = await axios(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(str)}&key=${ytApiKey}`);
		if (body.data.items[0] === undefined) {
			return null;
		} else {
			return body.data.items[0].id.videoId;// By : xR1. || 
		}
	}// By : xR1. || 
}

function addToQueue(strID) {
	if (strID.indexOf("youtube.com")) {
		queue.push(getYTID(strID));// By : xR1. || 
	} else {
		queue.push(strID);
		songsQueue.push(strID);// By : xR1. || 
	}
}
// By : xR1. || 
function skipSong(message) {
	dispatcher.end();// By : xR1. || 
}
/*------------------------------*/
/* MUSIC CONTROL FUNCTIONS END */
/*----------------------------*/

/*----------------------------------*/
/* YOUTUBE CONTROL FUNCTIONS START */
/*--------------------------------*/
async function searchYouTube(str) {
	let search = await axios(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(str)}&key=${ytApiKey}`);
	if (search.data.items[0] === undefined) {
		return null;
	} else {
		return search.data.items;
	}
}

async function getYouTubeResultsId(ytResult, numOfResults) {
	let resultsID = [];// By : xR1. || 
	await youtube.searchVideos(ytResult, numOfResults)
		.then(results => {// By : xR1. || 
			for (const resultId of results) {
				resultsID.push(resultId.title);
			}// By : xR1. || 
		})
		.catch(err => console.log(err));
	return resultsID;// By : xR1. || 
}
/*--------------------------------*/
/* YOUTUBE CONTROL FUNCTIONS END */
/*------------------------------*/

/*-----------------------*/
/* MISC FUNCTIONS START */
/*---------------------*/
function shuffle(queue) {
	for (let i = queue.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[queue[i], queue[j]] = [queue[j], queue[i]];// By : xR1. || 
	}
	return queue;
}// By : xR1. || 

/*---------------------*/
/* MISC FUNCTIONS END */
/*-------------------*/

/*---------------------*/
/* اقتراح الاغاني. , بداية*/
/*-------------------*/
							 const sugg = [
                          'El Joker - El Mo5tar l الجوكر - المختار',
                          'El Joker - Met.hamesh l الجوكر - متهمش',
                          'Seif Amer - Mawjou Galbi - Official Audio | سيف عامر - موجوع قلبي - الأوديو الرسمي',
                          'El Joker - W El Oghnia De 7aram l الجوكر - و الأغنية دى حرام',
                          'El Joker - Enfsam 7ad l الجوكر - انفصام حاد',
                          'Ahmed Mekky - Atr AL Hayah | أحمد مكى - قطر الحياة فيديو كليب',
                          'الشاعر هشام الجخ - قصيدة مصلتش العشا - حلوة يا دنيا',
                          'أحمد مكى و محمود الليثى - ( آخرة الشقاوه ) - (Ahmed Mekky & Mahmoud Al Liethy ( Akhret Al Shaqawa',
                          'Al Donya - أغنية الدنيا - غدر الصحاب | Zap Tharwat & Sary Hany ft. Tarek El Sheikh',
                          'اول واحد | شادى سرور (فيديو كليب حصري)',
                          'فين الصحاب | شادى سرور (فيديو كليب حصري)',
                          'Ahzee – Go Gyal (Official Music Video) (HD) (HQ)',
                          'ABYUSIF - THANOS | ابيوسف - ثانوس',
                          'يتوغل يتسرب ... ABYUSIF',// By : xR1. || 
                          'Abyusif Ya Bro Prod By Abyusif',
                          'El Joker - Salma l الجوكر - سلمى',
                          'El Joker - El Da3t l الجوكر - الضغط',// By : xR1. || 
                          'El Joker - 90s l الجوكر - تسعيناتى',
                          'El Joker - 01 April l الجوكر - ١ أبريل',
                          'El Joker - Monalisa Tania l الجوكر - موناليزا تانية',
                          'El Joker - Kam Kelma l الجوكر - كام كلمة',// By : xR1. || 
                          'El Joker - Ana I l الجوكر - أنا الجزء الاول',
                          'El Joker - Ana II l الجوكر - أنا الجزء الثانى',
                          'El Joker - Eskot l الجوكر - اسكت',
                          'م	',
                          ]
// By : xR1. || 
/*---------------------*/// By : xR1. || 
/* اقتراح الاغاني. , نهاية*/
/*-------------------*/// By : xR1. || 
// By : xR1. || 
/*---------------------*/// By : xR1. || 
/* اوامر المساعدة , بداية */
/*-------------------*/// By : xR1. || 

   bot.on("message", message => {// By : xR1. || 
    if (message.content === initcmd +"help") {
     const embed = new Discord.RichEmbed()
         .setColor("36393f")// By : xR1. || 
         .setDescription(`**
───╔═══╦╗─╔╗─╔╗
───║╔═╗║║─║║─║║
╔═╗╚╝╔╝║║╔╣╚═╝╠══╗
║╔╗╦╗╚╗║╚╝╩══╗║╔╗║
║║║║╚═╝║╔╗╗──║║╔╗║
╚╝╚╩═══╩╝╚╝──╚╩╝╚╝
Bot Version : ${version}
Developer By : <@462006869834203159>
**`)
   message.channel.send({embed});
// By : xR1. || 
   }
   });// By : xR1. || 

   bot.on("message", message => {
   	   	        let xR1 = message.guild.member(message.author).roles.find('name', 'Dj');
                if(!xR1)
    if (message.content === initcmd +"help") {
     const embed = new Discord.RichEmbed()
         .setColor("36393f")// By : xR1. || 
         .setDescription(`**
         [Commands Help.]
${initcmd}play [NameMusic/Ulr] -> لتشغيل الاغاني , واذا لم تعمل انتظر قائمة التشغيل
${initcmd}skip ->  يتخطى الأغنية الحالية
${initcmd}playlist ->  يعرض قائمة التشغيل الحالية
${initcmd}repeat ->  يكرر تشغيل الاغنية من جديد
${initcmd}yt [search term] ->  يبحث في YouTube ويعرض أول 5 نتائج
${initcmd}add -> يضيف أغنية من بحث YouTube إلى قائمة التشغيل
${initcmd}vol ->  يحدد حجم الموسيقى إلى نسبة معينة
${initcmd}help or ${initcmd}commands ->  يعرض لك الاوامر البوت المتاحة
**`)// By : xR1. || 
   message.channel.send({embed});

   }
   });// By : xR1. || 

/////////// By : xR1. || 

   bot.on("message", message => {
   	        let xR1 = message.guild.member(message.author).roles.find('name', 'Dj');
                if(!xR1) return
    if (message.content === initcmd +"help") {
     const embed = new Discord.RichEmbed()// By : xR1. || 
         .setColor("36393f")// By : xR1. || 
         .setDescription(`**
         [Commands Help.]
${initcmd}play [NameMusic/Ulr] -> لتشغيل الاغاني , واذا لم تعمل انتظر قائمة التشغيل
${initcmd}skip ->  يتخطى الأغنية الحالية
${initcmd}playlist ->  يعرض قائمة التشغيل الحالية
${initcmd}playlist remove [song number] ->  يزيل الأغنية المختارة من قائمة التشغيل (Dj)
${initcmd}playlist clear ->  يزيل كل الأغاني من قائمة التشغيل (Dj)
${initcmd}playlist shuffle ->  يغير قائمة التشغيل الحالية (Dj)
${initcmd}repeat ->  يكرر تشغيل الاغنية من جديد
${initcmd}stop ->  يتوقف عن تشغيل الموسيقى ويحذف جميع الأغاني في قائمة التشغيل (Dj)
${initcmd}yt [search term] ->  يبحث في YouTube ويعرض أول 5 نتائج
${initcmd}add -> يضيف أغنية من بحث YouTube إلى قائمة التشغيل
${initcmd}vol ->  يحدد حجم الموسيقى إلى نسبة معينة
${initcmd}help or ${initcmd}commands ->  يعرض لك الاوامر البوت المتاحة
**`)
   message.channel.send({embed});// By : xR1. || 

   }// By : xR1. || 
   });

   bot.on("message", message => {
    if (message.content === initcmd +"help") {
     const embed = new Discord.RichEmbed()
         .setColor("36393f")
         .setDescription(`**
         [Commands Owner.]
${initcmd}SettingsDj -> لظبط اعدادات
${initcmd}wt [الحالة الجديدة] -> Watching - لتعين حالة للبوت
${initcmd}ls [الحالة الجديدة] -> Listening - لتعين حالة للبوت
${initcmd}st [الحالة الجديدة] -> Streaming - لتعين حالة للبوت
${initcmd}setname [الاسم الجديد] -> UserName New - لوضع اسم جديد للبوت.
${initcmd}setavatar [عنوان الصورة الجديده] -> New Avatar - لوضع صورة جديده للبوت.
**`)
   message.channel.send({embed});
// By : xR1. || 
   }
   });
// By : xR1. || 

/*---------------------*/
/* اوامر المساعدة , نهاية*/
/*-------------------*/

/*---------------------*/
/* اوامر خاصة بصاحب البوت */
/*-------------------*/

bot.on('message', message => {// By : xR1. || 
    var argresult = message.content.split(` `).slice(1).join(' ');
      if (!botxR1.includes(message.author.id)) return;
// By : xR1. || 
  if (message.content.startsWith(initcmd + 'wt')) {
  bot.user.setActivity(argresult, {type:'WATCHING'});// By : xR1. || 
      message.channel.send(` ☑ Client Activity Now Is : \`Watching ${argresult} \` `)
  } else
  if (message.content.startsWith(initcmd + 'ls')) {// By : xR1. || 
  bot.user.setActivity(argresult , {type:'LISTENING'});
      message.channel.send(` ☑ Client Activity Now Is : \`Listening ${argresult} \` `)
  } else
  if (message.content.startsWith(initcmd + 'st')) {// By : xR1. || 
    bot.user.setGame(argresult, "https://www.twitch.tv/xR1");
     message.channel.send(` ☑ Client Activity Now Is : \`Streaming ${argresult} \` `)
  }
  if (message.content.startsWith(initcmd + 'setname')) {// By : xR1. || 
  bot.user.setUsername(argresult).then
      message.channel.send(` Client UserName Changed To : \` ${argresult}\` `)
} else
if (message.content.startsWith(initcmd + 'setavatar')) {// By : xR1. || 
  bot.user.setAvatar(argresult);
      message.channel.send(` Client Avatar Changed To : \` ${argresult}\` `)
}// By : xR1. || 
});
// By : xR1. || 
/*---------------------*/
/* نهاية اوامر الخاصة بصاحب البوت. */
/*-------------------*/
// By : xR1. || 

bot.login(botSettings.token);
