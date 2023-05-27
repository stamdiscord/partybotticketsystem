const fs = require("fs");

module.exports = (client) => {
	const MenuInteractions_files = fs.readdirSync(`./src/botInteractions/menu_interactions/`).filter(file => file.endsWith(".js"));
	for (const file of MenuInteractions_files) {
		const menuInteraction = require(`../botInteractions/menu_interactions/${file}`);
		if (menuInteraction.name) {
			client.menuInteractions.set(menuInteraction.name, menuInteraction);
		} else {
			console.log("Command Name error!");
		}
	}
}