const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	name: "ping",
    ephemeral: false,
	description:"Pinga botten. Se om dem är uppkopplad och hur lång tid det tar!",
    usage:["Ping - /ping"],
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Ping the bot!")
        .setDefaultMemberPermissions(null) //true - All has perms for this commands, false - Admin command
    ,
	async do(Interaction, profileData) {

		const pinging_embed = new EmbedBuilder()
			.setColor("#2DD21C")
			.setTitle(`:ping_pong:  Ping`)
			.setDescription(`Pingar...`)
			.setFooter({text:this.name,iconURL:Interaction.client.user.avatarURL()});

		let botMessage = await Interaction.editReply({embeds:[pinging_embed], ephemeral:false, fetchReply:true} );

		const pong_embed = new EmbedBuilder()
			.setColor("#2DD21C")
			.setTitle(`:ping_pong:  Pong`)
			.setFooter({text:this.name,iconURL:Interaction.client.user.avatarURL()})
			.setDescription(`Tog ${botMessage.createdTimestamp - Interaction.createdTimestamp} millisekunder!`)
        
            Interaction.editReply({embeds:[pong_embed]})
	}
}
