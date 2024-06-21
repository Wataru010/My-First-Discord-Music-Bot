const { SlashCommandBuilder } = require('@discordjs/builders');
const { useHistory } = require("discord-player");

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('back')
        .setDescription('Going back for one music/track.'),
        async execute(interaction) {
            const history = useHistory(interaction.guild.id);

            try{
                if(history == null || history.isEmpty()){
                    interaction.reply('Failed to go back one track!');
                }else{
                    interaction.reply('Went back for one track!');
                    history.previous();
                }
            }catch(error){
                console.log(error);
            }
        }
}