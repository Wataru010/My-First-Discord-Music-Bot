const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: 
        new SlashCommandBuilder()
        .setName('exit')
        .setDescription('Stop the running process of the bot.'),
        async execute(interaction) {
            try{
                interaction.reply('Bot has shut down!');

                setTimeout(()=>{
                    process.exit(1);
                }, 2000);

            }catch(error){
                console.log(error);
            }
        }
}