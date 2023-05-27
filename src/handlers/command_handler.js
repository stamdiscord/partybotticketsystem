const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = (client) =>{
	let files = fs.readdirSync(`./src/botInteractions/commands/`,{withFileTypes:true})
	const command_dirs = files.filter(file => file.isDirectory())
	let command_files = files.filter(file => file.name.endsWith(".js")).map(file => `../botInteractions/commands/${file.name}`);
	command_dirs.forEach(dir => {
		let moreCommandFiles = fs.readdirSync(`./src/botInteractions/commands/${dir.name}`).filter(file => file.endsWith(".js"));
		moreCommandFiles.forEach(file => command_files.push(`../botInteractions/commands/${dir.name}/${file}`));
	})
	for (const file of command_files) {
		const command = require(file);
		if (command.name) {
			client.commands.set(command.name, command);
			if(command.aliases != undefined) {
				command.aliases.forEach(async element => {
					let aliasData = command.data.toJSON();
					aliasData.name = element;
					client.commandArray.push(aliasData)
				});
			}
			if(command.data != undefined) client.commandArray.push(command.data.toJSON())
		} else {
			console.log("Command Name error!");
		}
	}
}