const { YoutubeExtractor, SpotifyExtractor } = require('@discord-player/extractor');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue, QueryType } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('spotify_playlist')
        .setDescription('Play a playlist from spotify.')
        .addStringOption(option => option
            .setName('query')
            .setDescription('Url for the playlist on spotify.')
            .setRequired(true)
            ),
        async execute(interaction){
            await interaction.deferReply();
            
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

            const url = interaction.options.getString('query');
            const voice_channel = interaction.member.voice.channel;

            // warning the user the user to join the voice channel before using the music bot
            if (!voice_channel) {
                interaction.reply('You are not connected to a voice channel!');
                return;
            }

            await player.extractors.register(SpotifyExtractor, {});
            
            if (!queue.channel) await queue.connect(voice_channel);

            try{
                const spotify_playlist = await player.search(url, {
                    searchEngine: QueryType.SPOTIFY_PLAYLIST,
                    requestedBy: interaction.user.tag,
                });

                // console.log(spotify_playlist['_data']);

                if (!spotify_playlist.hasTracks() || !spotify_playlist.hasPlaylist()){
                    interaction.editReply(`No such playlist!`);
                    return;
                }

                await player.extractors.register(YoutubeExtractor, {});

                console.log("Loading . . .");
                console.log("-------------------------------------------------------------------------");
                const list = [];
                let count = 1;
                for(const track of spotify_playlist.tracks){
                    const single = await player.search(track['raw'].description, {
                        searchEngine: QueryType.YOUTUBE_SEARCH,
                        requestedBy: interaction.user.tag,
                    })
                    // queue.addTrack(single.tracks[0]);
                    list.push(single.tracks[0]);
                    console.log(count + ". " +single.tracks[0].title);
                    count++;
                }
                console.log("-------------------------------------------------------------------------");
                queue.addTrack(list);

                await interaction.editReply(`Spotify Playlist: **${spotify_playlist.playlist.description}** is Added!`)

                if (!queue.isPlaying()) await queue.node.play();
                
            }catch(error){
                console.log(error);
            }finally{
                queue.tasksQueue.release();
            }
        }
}