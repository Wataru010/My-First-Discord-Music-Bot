const { YoutubeExtractor, SpotifyExtractor } = require('@discord-player/extractor');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue, QueryType } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('spotify_single')
        .setDescription('Play a single music from spotify.')
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

            const query = interaction.options.getString('query');
            const voice_channel = interaction.member.voice.channel;

            // warning the user the user to join the voice channel before using the music bot
            if (!voice_channel) {
                interaction.reply('You are not connected to a voice channel!');
                return;
            }

            await player.extractors.register(SpotifyExtractor, {});
            
            if (!queue.channel) await queue.connect(voice_channel);

            try{
                let spotify_single = await player.search(query, {
                    searchEngine: QueryType.SPOTIFY_SONG,
                    requestedBy: interaction.user.tag,
                });

                if (!spotify_single.hasTracks() && !spotify_single.hasPlaylist()){
                    spotify_single = await player.search(query, {
                        searchEngine: QueryType.SPOTIFY_SEARCH,
                        requestedBy: interaction.user.tag,
                    });

                    // console.log(spotify_single.tracks);
                    
                    if (!spotify_single.hasTracks() && !spotify_single.hasPlaylist()){
                        interaction.reply(`No such track ${query}!`);
                        return;
                    }
                }

                await player.extractors.register(YoutubeExtractor, {});

                const youtube_result_list = await player.search(spotify_single.tracks[0].description, {
                    searchEngine: QueryType.YOUTUBE_SEARCH,
                    requestedBy: interaction.user.tag,
                });

                if (!youtube_result_list.hasTracks() && youtube_result_list.playlist){
                    interaction.reply(`No such track ${query}!`);
                    // console.log(`No such track ${query}!`);
                    return;
                }

                queue.addTrack(youtube_result_list.tracks[0]);

                await interaction.reply(`Song: **${spotify_single.tracks[0].title}** Added!`);

                if (!queue.isPlaying()) await queue.node.play();
                
            }catch(error){
                console.log(error);
            }finally{
                queue.tasksQueue.release();
            }
        }
}