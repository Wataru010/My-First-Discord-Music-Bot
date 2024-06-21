const { YouTubeExtractor } = require('@discord-player/extractor');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue, QueryType } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a single music from youtube.')
        .addStringOption(option => option
            .setName('query')
            .setDescription('Search query that you want to play.')
            .setRequired(true)
            ),
        async execute(interaction){
            const player = useMainPlayer();

            // initalize a queue for the bot
            const queue = (() =>{
                if(useQueue(interaction.guild.id) == null){
                    return player.nodes.create(interaction.guild, {
                        leaveOnEmpty: false,
                        leaveOnEnd: false,
                        leaveOnStop: false,
                    });
                }
                return useQueue(interaction.guild.id);
            })();

            const entry = queue.tasksQueue.acquire();
            await entry.getTask();

            // queue.node.setBitrate(128000);
            const query = interaction.options.getString('query');
            const voice_channel = interaction.member.voice.channel;

            // warning the user the user to join the voice channel before using the music bot
            if (!voice_channel) {
                interaction.reply('You are not connected to a voice channel!');
                return;
            }

            // registering extractor YouTube
            await player.extractors.register(YouTubeExtractor, {});

            if (!queue.channel) await queue.connect(voice_channel);

            try{
                const result_list = await player.search(query, {
                    searchEngine: QueryType.YOUTUBE_SEARCH, //comment out this if needed
                    requestedBy: interaction.user.tag,
                });

                if (!result_list.hasTracks()){
                    interaction.reply(`No such track ${query}!`);
                    return;
                }

                await interaction.reply(`Song: ${result_list.tracks[0].metadata['title']} Added!`);
                queue.addTrack(result_list.tracks[0]);

                if (!queue.isPlaying()) await queue.node.play();
                
            }catch(error){
                console.log(error);
            }finally{
                queue.tasksQueue.release();
            }
        }
}