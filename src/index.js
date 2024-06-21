/*
    Author: Sihua Zhou 
    Resource/Documents: 
    - Discord.js
        - https://old.discordjs.dev/#/docs/discord.js/main/general/welcome
        - https://discordjs.guide/
    - Discord Player
        - https://discord-player.js.org/guide/welcome/welcome
        - https://discord-player.js.org/docs/discord-player/class/Player
    
    Disclaimer: 
        This Bot is developed for educational purpose.
        Program is not involved in any form of commercial activity and should not be treated as such.
*/

// require for necessary functions
// enable use of .env file
require('dotenv').config();

// class from discord.js
const { Client, IntentsBitField, EmbedBuilder, REST, Routes, Collection} = require('discord.js');

// class from discord-player and its extractor
const { Player, useMainPlayer } = require('discord-player');
// const { SoundCloudExtractor, YouTubeExtractor } = require('@discord-player/extractor');

// class from file_system and path
const fs = require('node:fs');
const path = require('node:path');

// initialize client(the bot itself) with certain permission
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});


/*
    Register Commands
*/
// array to contain commands
const commands = [];
client.commands = new Collection();

// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// store sets of commands from commands folder (.js files)
for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
        client.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();


/*
    Music Player
*/
// intitalize music player
const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
    },
});

/*
    Music Player Event Listeners
*/
player.events.on('playerStart', (queue, track) => {
    // Emitted when the player starts to play a song
    const music_channel = queue.guild.channels.cache.find(channel => channel.name === 'music_is_playing');
    music_channel.send(`Started playing: **${track.title}** *${track.duration}*`);
    // track.requestedBy.username
    
    console.log("\n----------------------------------------------------------------------------------");
    console.log("\nCurrent Tracks: ");
    console.log(queue.currentTrack.metadata['title']);
    console.log("\nCurrent Queue: ");
    for(const track of queue.tracks.toArray()){
        console.log(track.metadata['title']);
    }
    console.log("\n----------------------------------------------------------------------------------");
});


/*
    Slash Commands Actions
*/
client.on('interactionCreate', async (interaction)=>{
    if(!interaction.isCommand) return;
    
    const command = client.commands.get(interaction.commandName);
    await command.execute(interaction);
    // console.log(interaction.options['_hoistedOptions']);

});


/*
    Login Bot
*/
// event listern when bot is ready
client.on('ready', (bot)=>{
    console.log(`Bot ${bot.user.tag} is now online!`);
    const bot_channel = bot.channels.cache.find(channel => channel.name === 'bot_status');
    // bot_channel.send('Wait for bot to be online');
    setTimeout(()=>{
        // bot_channel.send(`BOT **${bot.user.tag}** coming online!`);
    }, 3000); 
});

// login the bot to the server
client.login(process.env.BOT_TOKEN);

// handle uncaught exceptions to not let the program crash
process.on('uncaughtException', (err, origin) => {
    console.log("\n---------------------------------------------------------------------------------");
    console.log("Error Message:\n" + err);
    console.log("Origin:\n" + origin);
    console.log("---------------------------------------------------------------------------------\n");
});






