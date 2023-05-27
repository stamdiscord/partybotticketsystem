const {SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, ButtonStyle} = require('discord.js');

module.exports = {
	name: "sendmessage",
    ephemeral: false,
    description:"Skicka ett meddelande till servern som Gamerbot",
    defer:false,
    usage:[
        "Skicka ett vanligt meddelande - /sendmessage channel:<Channel> message:<meddelandet gamer bot ska Skicka>",
        "Skicka ett meddelande med en knapp - /sendmessage channel:<Channel> message:<meddelandet gamer bot ska Skicka> options:<name-CustomId>"
    ],
	data: new SlashCommandBuilder()
		.setName("sendmessage")
		.setDescription("Send a message to any channel! With difrent options")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) //true - All has prems for this commands, false - Admin command
        .addChannelOption((option)=>{
            return option.setName("channel").setDescription("the channel the message is going to!").setRequired(true);
        })
        .addStringOption((option)=>{
            return option.setName("options").setDescription("Add buttons [name-customID]").setRequired(false)
        })
    ,
	async do(Interaction) {
        let channel = Interaction.options._hoistedOptions[0].channel;
        let option = (Interaction.options._hoistedOptions[1] == undefined) ? false : Interaction.options._hoistedOptions[1].value
        let row;
        let message;
        const modal = new ModalBuilder()
                .setTitle("Send message")
                .setCustomId(`send_message:${Interaction.id}`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("Skriv det som ska sickas ut!")
                                .setPlaceholder("Skriv här...")
                                .setStyle("Paragraph")
                                .setCustomId(`send_message_message`)
                        )
                )
        await Interaction.showModal(modal);
        const filter = (i) => i.customId.split(":")[1] == Interaction.id;
        Interaction.awaitModalSubmit({filter,time:10*1000*60}).then(async data =>{
            message = data.fields.getTextInputValue("send_message_message")
            if(option){
                if(option == "mobvote"){
                    await channel.send({content: message, components:[this.mobVote]}); 
                }else{

                    row = new ActionRowBuilder()
                    .addComponents(
                        [
                            new ButtonBuilder()
                                .setStyle("Success")
                                .setCustomId(option.split("-")[1])
                                .setLabel(option.split("-")[0])
                        ]
                    );
                    await channel.send({content: message, components:[row]}); 
                }
            }
            else await channel.send({content: message});
            await data.reply(`The bot has now sent the message to <#${channel.id}>`);
        }).catch(err =>{
            console.log(`${err}\nPerson dosen't write in model`)
        })

	},
    mobVote: new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Sniffer")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("vote;sniffer"),
        new ButtonBuilder()
            .setLabel("Rascal")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("vote;rascal"),
        new ButtonBuilder()
            .setLabel("Tuff golem")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("vote;tuffgolem"),
        
    )
}
