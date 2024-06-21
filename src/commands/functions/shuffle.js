const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue.'),
        async execute(interaction) {
            const queue = useQueue(interaction.guild.id);

            try{
                if(queue == null){
                    await interaction.reply('Queue doesn\'t exist play some music first!');
                }else{
                    if(queue.size == 0){
                        await interaction.reply('No more music in the queue, cannot shuffle!');
                    }else{
                        await interaction.reply('Current queue has been shuffled!')
                        queue.tracks.shuffle();
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