const fs = require("fs");

module.exports = (client) =>{
	const mentionCommandFiles = fs.readdirSync(`./src/botInteractions/mentionCommand/`).filter(file => file.endsWith(".js"));
	for (const file of mentionCommandFiles) {
		const command = require(`../botInteractions/mentionCommand/${file}`);
		if (command.name) {
			client.mentionCommands.set(command.name, command);
		} else {
			console.log("Command Name error!");
		}
	}
}