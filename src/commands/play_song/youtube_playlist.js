const { YouTubeExtractor } = require('@discord-player/extractor');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue, QueryType } = require("discord-player");
// const ytpl = require('ytpl');

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Play the list of musics of a youtube playlist.')
        .addStringOption(option => option
            .setName('playlist_link')
            .setDescription('Url for the playlist on youtube.')
            .setRequired(true)
            ),
        async execute(interaction) {
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
            const url = interaction.options.getString('playlist_link');
            const voice_channel = interaction.member.voice.channel;

            // warning the user the user to join the voice channel before using the music bot
            if (!voice_channel) {
                interaction.reply('You are not connected to a voice channel!');
                return;
            }

            // registering extractor YouTube
            await player.extractors.register(YouTubeExtractor, {});

            // queue.node.setBitrate()

            if (!queue.channel) await queue.connect(voice_channel);

            // interaction.deferReply();

            try{
                // if(!ytpl.validateID(url)){
                //     interaction.reply(`No playlists found with ${url}!`);
                //     return;
                // }

                // const playlist = await ytpl(url);
                
                // interaction.reply(`Playlist: **${playlist.title}** Added! `);

                // for(const music of playlist.items){
                //     const result = await player.search(music.shortUrl, {
                //             searchEngine: QueryType.YOUTUBE_SEARCH, //comment out this if needed
                //             requestedBy: interaction.user.tag,
                //         });
                    
                //     for(const track of result.tracks){
                //         queue.addTrack(track);
                //         console.log(track.title);
                //     }
                // }
                const result_list = await player.search(url, {
                    searchEngine: QueryType.YOUTUBE_PLAYLIST, //comment out this if needed
                    requestedBy: interaction.user.tag,
                });

                if (!result_list.hasTracks() || !result_list.playlist){
                    interaction.reply(`No such playlist!`);
                    return;
                }
                queue.addTrack(result_list.tracks);

                if (!queue.isPlaying()) await queue.node.play();

                // console.log(result_list.tracks);

                interaction.reply(`Playlist: **${result_list.playlist.description}** Added!`);


            }catch(error){
                console.log(error);
            }finally{
                queue.tasksQueue.release();
            }
        }
}