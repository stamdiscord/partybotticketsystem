const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v9');
const { ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ButtonStyle, TextInputStyle } = require('discord.js');

module.exports = {
	name: "ticket",
    defer:false,
	async do(Interaction, args) {
        if(args[4] != undefined) await this.openTicket(Interaction, Interaction.member, `Här kan du prata med Killar.se! <@${Interaction.member.user.id}> ! <@&1083480696607211621>`, true, true)
        else if(args[0] == "open") await this.openTicket(Interaction , Interaction.member, `Tack för att du öppnade en ticket! <@` + Interaction.member.user.id + `> ! <@&929904537832140840>  kommer svara inom kort!`);
        else if(args[0] == "close") await this.closeTicket(Interaction,args[1],args[2], JSON.parse(args[3]));
        else if(args[0] == "note") await this.noteTicket(Interaction,args[1],args[2]);
        else if(args[0] == "archive") await this.archiveTicket(Interaction,args[1],args[2]);
	},
    async openTicket (Interaction, member, sendString, defer = true, killar = false){
        return new Promise(async resolve =>{
            let ticketParent = "821139274589274143";
            if(ticketParent == "") return Interaction.channel.send("Du behöver sätta in ID till en ticket kategori!")
        
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle("Danger")
                        .setLabel("Lämna ticket")
                        .setCustomId(`ticket;close;${member.user.id};false`)
                )
            
            const modal = new ModalBuilder()
                .setTitle("Ticket")
                .setCustomId(`ticket_help:${Interaction.id}`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("Skriv en beskrivning vad du behöver hjälp med")
                                .setPlaceholder("Skriv här...")
                                .setStyle("Paragraph")
                                .setCustomId(`ticket_help_description:${Interaction.id}`)
                        )
                )

            await Interaction.showModal(modal);

            const filter = (i) => i.customId.split(":")[1] == Interaction.id;
            Interaction.awaitModalSubmit({filter,time:60*1000*4})
                .then(async interact =>{
                    let description = interact.fields.getTextInputValue(`ticket_help_description:${Interaction.id}`);
                    let channel = await Interaction.guild.channels.create({
                        name: (killar == false) ? `ticket - ${member.user.username}` : `killar-${member.user.username}`,
                        type: ChannelType.GuildText,
                        parent:ticketParent,
                        permissionOverwrites:[
                            {
                                id: Interaction.guild.roles.everyone.id,
                                deny:[ PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                                allow:[PermissionFlagsBits.AttachFiles]
                            },
                            {
                                id: member.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.AttachFiles ]
                            }
                        ]
                    })
                    let message = await channel.send({content:`${sendString}\nBeskrivningen för problemet är:\n\`${description}\``, components:[row], fetchReply: true})
                    row.components[0].setCustomId(`ticket;close;${message.id};${member.user.id};false`)
                    await message.edit({components:[row]});
                    if(defer) interact.deferUpdate();
                    resolve({channel:channel, interaction:interact});
                }).catch(err =>{
                    console.log(`${err}\nPerson dosen't write in model`)
                })

        })
    },
    async closeTicket(Interaction, messageID, memberID, removeTicket){
        let member = await Interaction.guild.members.cache.get(memberID);
        let message = await Interaction.channel.messages.cache.get(messageID)
        if(removeTicket){
            await Interaction.reply(`Tar bort kanalen om 5 sekunder...`)
            setTimeout(()=>Interaction.channel.delete(), 5000)
        }
        else{
            await Interaction.deferUpdate();

            await Interaction.channel.permissionOverwrites.edit(member,{
                SendMessages:false,
                ViewChannel:false
            })
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji("💾")
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("arkivera")
                        .setCustomId(`ticket;archive;${messageID};${member.user.id}`),
                    new ButtonBuilder()
                        .setStyle("Danger")
                        .setEmoji("🗑️")
                        .setLabel("Radera")
                        .setCustomId(`ticket;close;${messageID};${member.user.id};true`)
                )
            message.reply({ content: `Nu har <@${member.id}> lämnat ticketen. Vill ni arkivera eller slänga ticketen?`, components: [row] })
        }
    },
    noteModule : new ModalBuilder().setCustomId("noteadd").setTitle("Add note").addComponents(
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setLabel("Add note")
                    .setPlaceholder("note...")
                    .setCustomId("noteid")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
            )
    ),
    async noteTicket(Interaction, messageID, memberID) {
        
        await Interaction.showModal(this.noteModule);
        Interaction.awaitModalSubmit({time:60*1000*5}).then(async interact=>{

            let noteSave = interact.fields.getTextInputValue("noteid")

            await note(await Interaction.guild.members.cache.get(memberID), `Ticket note: ${noteSave}`, Interaction.user.id)
            
            await interact.reply(`Tar bort kanalen om 5 sekunder...`)
            setTimeout(()=>Interaction.channel.delete(), 5000)
        }).catch(err =>{
            console.log(`${err}\nPerson dosen't write in model`)
        })
    },
    async archiveTicket(Interaction, messageID, memberID) {

        let archivedTicketParent = "1073314502600294400"

        if (!archivedTicketParent) {
            Interaction.reply("Det gick inte att arkivera ticketen eftersom att guild config värdet `archivedTicketParent` inte är definierat! Medlemmen noterades dock ändå.")
            return
        }

        await Interaction.reply(`Arkiverar kanalen om 5 sekunder...`)
        setTimeout(async ()=>{
            await Interaction.channel.setParent(archivedTicketParent)
        }, 5000)

    },
}
