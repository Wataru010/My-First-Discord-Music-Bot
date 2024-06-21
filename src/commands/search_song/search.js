const { YouTubeExtractor, SoundCloudExtractor, SpotifyExtractor, BridgeProvider, BridgeSource } = require('@discord-player/extractor');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, QueryType } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('search')
        .setDescription('search some music')
        .addStringOption(option => option
            .setName('input_string')
            .setDescription('pass url or text or discord-player track constructable objects, we got you covered 😎')
            .setRequired(true)
            ),
        async execute(interaction, searchQuery){
            const player = useMainPlayer();
            // const bridgeProvider = new BridgeProvider(BridgeSource.SoundCloud);
            // await player.extractors.register(SoundCloudExtractor, {
            //     bridgeProvider
            // });
            console.log("\n---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\nrequested by: "+interaction.user.tag +"\n")
            await player.extractors.register(YouTubeExtractor, {});
            try{
                const result = await player.search(searchQuery[0]['value'], {
                    searchEngine: QueryType.YOUTUBE_SEARCH,
                    // searchEngine: `ext:${SoundCloudExtractor.identifier}`,
                    requestedBy: interaction.user.tag,
                });
                // console.log(result);
                
                // for youtube
                for(const track of result.tracks){
                    console.log(track.metadata['title'] + " - " + track.metadata['channel']['name']);
                    // interaction.channel.send(track.metadata['title'] + " -- " + track.metadata['channel']['name']);
                }

                // for soundcloud
                // for(const track of result.data.tracks){
                //     console.log(track);
                // }
                // console.log(result.data.tracks);
            }catch(error){
                console.error('Failed to search for track with player.search() with query');
                console.log(error);
            }
        },
} 