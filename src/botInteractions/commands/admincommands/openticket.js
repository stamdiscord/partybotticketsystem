const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const { openTicket } = require('../../menu_interactions/ticket');

module.exports = {
	name: "openticket",
    ephemeral: false,
	description:"Öppna en ticket för en användare på discorden!",
    usage:["öppna ticket - /openticket user:<Personen du vill öppna ticker för!>"],
    defer: false,
	data: new SlashCommandBuilder()
		.setName("openticket")
		.setDescription("Öppna en ticket för en användare på discorden!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) //true - All has perms for this commands, false - Admin command
        .addUserOption((Option)=>{
            return Option.setName("user").setDescription("Personen du vill öppna en ticket för").setRequired(true)
        })
    ,
	async do(Interaction) {
        let channel = await openTicket(Interaction,Interaction.options._hoistedOptions[0].member,`Vi har öppnat en ticket för dig! <@` + Interaction.options._hoistedOptions[0].member.id + `> ! <@&812348382810210314> kommer svara inom kort!\nDu kan lämna ticket:en om du trycker på ⛔`,false)
        channel.interaction.reply(`Vi har nu öppnat en ticket för <@${Interaction.options._hoistedOptions[0].member.id}>, ticket kanalen är <#${channel.channel.id}>`)
	}
}
