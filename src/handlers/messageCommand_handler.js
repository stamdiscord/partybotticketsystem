const fs = require("fs");

module.exports = (client) =>{
	const messageCommandFiles = fs.readdirSync(`./src/botInteractions/messageCommand/`).filter(file => file.endsWith(".js"));
	for (const file of messageCommandFiles) {
		const command = require(`../botInteractions/messageCommand/${file}`);
		if (command.name) {
			client.messageCommands.set(command.name, command);
		} else {
			console.log("Command Name error!");
		}
	}
}