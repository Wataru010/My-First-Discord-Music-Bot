const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing the current queue.'),
        async execute(interaction) {
            const queue = useQueue(interaction.guild.id);

            try{
                if(queue == null){
                    await interaction.reply('Queue doesn\'t exist play some music first!');
                }else{
                    queue.delete();
                    await interaction.reply('Current queue stopped playing!');
                }
            }catch(error){
                console.log(error);
            }
        }
}