const { InteractionType, ChannelType } = require("discord.js");

module.exports = async (Interaction, client) => {
    if(Interaction.guildId == null) return Interaction.reply(`Du kan bara skicka commands i en server!`)

    if (Interaction.isContextMenuCommand()) contextmenu_interaction(Interaction , client);
    else if (Interaction.type === InteractionType.ApplicationCommand) commandInteraction(Interaction,client);
    else componentInteraction(Interaction, client)
}

async function commandInteraction(Interaction, client){
    let command = client.commands.get(Interaction.commandName)
    if (!command){
        client.commands.forEach(element => {
            if(element.aliases !=undefined){
                if(element.aliases.find(alias => alias == Interaction.commandName) != undefined) command = element;
            }
        });
    }
    if(!command) return;
    try {
        if(command.defer == undefined || command.defer == true) await Interaction.deferReply({ephemeral:command.ephemeral});
        await command.do(Interaction);

    } catch (error) {
        console.error(error);
        await Interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}

async function contextmenu_interaction(Interaction, client){
    const command = client.contextMenusInteractions.get(Interaction.commandName)
    if (!command) return;
    try {
        if(command.defer) await Interaction.deferReply({ephemeral:command.ephemeral});
        await command.do(Interaction);

    } catch (error) {
        console.error(error);
        await Interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}

async function componentInteraction(Interaction, client){
    const menu = (client.menuInteractions.has(Interaction.customId.split(";")[0]) == true) ? client.menuInteractions.get(Interaction.customId.split(";")[0]) : false;
    if(menu){
        let args = (Interaction.customId.split(";").length == 1) ? undefined : Interaction.customId.split(";")
        args.splice(0,1);
        try{
            if(menu.defer) await Interaction.deferUpdate();
            menu.do(Interaction,args);
        }
        catch(err){
            await Interaction.deferUpdate();
            await Interaction.channel.send("There was an error while executing this Interaction!").then(mes => setTimeout(()=>mes.delete(),1000*5))
            console.log(err);
        }
    }
}