const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song and move on to the next track.'),
        async execute(interaction) {
            const queue = useQueue(interaction.guild.id);

            try{
                if(queue == null){
                    await interaction.reply('Queue doesn\'t exist play some music first!');
                }else{
                    await interaction.reply(`**${queue.currentTrack.title}** is skipped!`);
    
                    queue.node.skip();
                    
                    if(queue.size == 0){
                        await interaction.followUp('No more music in the queue!');
                    }  
                }
            }catch(error){
                console.log(error);
            }
        }
}