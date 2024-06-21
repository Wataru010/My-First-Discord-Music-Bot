const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Skip the current song and move on to the next track.')
        .addNumberOption(option =>
            option.setName('type')
                .setDescription('Choose to loop track or queue')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 0 },
                    { name: 'Track', value: 1 },
                    { name: 'Queue', value: 2 },
                )),
        async execute(interaction) {
            await interaction.deferReply();

            const queue = useQueue(interaction.guild.id);
            const mode = interaction.options.getNumber('type');

            try{
                if(queue == null){
                    await interaction.editReply('Queue doesn\'t exist play some music first!');
                }else{
                    if(mode == 0){
                        await interaction.editReply(`Current queue or track stops looping!`);
                        queue.setRepeatMode(mode);
                    }else if(mode == 1){
                        await interaction.editReply(`**${queue.currentTrack.title}** is looping!`);
                        queue.setRepeatMode(mode);
                    }else{
                        await interaction.editReply(`Current queue is looping!`);
                        queue.setRepeatMode(mode);
                    }
    
                    console.log("\n----------------------------------------------------------------------------------");
                    console.log("\nCurrent Tracks: ");
                    console.log(queue.currentTrack.metadata['title']);
                    console.log("\nCurrent Queue: ");
                    for(const track of queue.tracks.toArray()){
                        console.log(track.metadata['title']);
                    }
                    console.log("\n----------------------------------------------------------------------------------");
                }
            }catch(error){
                console.log(error);
            }
            
        }
}