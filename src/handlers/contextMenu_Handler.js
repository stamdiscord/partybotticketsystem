const fs = require("fs");

module.exports = (client) =>{
	const command_files = fs.readdirSync(`./src/botInteractions/contextmenu_interactions/`).filter(file => file.endsWith(".js"));
	for (const file of command_files) {
		const command = require(`../botInteractions/contextmenu_interactions/${file}`);
		if (command.name) {
			client.contextMenusInteractions.set(command.name, command);
			if(command.data != undefined) client.commandArray.push(command.data.toJSON()); 
			
		} else {
			console.log("Context menu error!");
		}
	}
}