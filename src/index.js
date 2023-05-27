const { Client, GatewayIntentBits, Collection } = require("discord.js");
require('dotenv').config();
const fs = require("fs");

const TOKEN = process.env.token;

//Creates the client that is going to do all actions!
const client = new Client(
	{
		partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.MessageContent
		]
	}
);


//Creates collections for commands and menu interactions
client.commands = new Collection();
client.menuInteractions = new Collection();
client.contextMenusInteractions = new Collection();
client.messageCommands = new Collection();
client.mentionCommands = new Collection();
client.commandArray = [];

//Loads and runs all handlers
let files = fs.readdirSync("./src/handlers")
files.forEach(file => require(`./handlers/${file}`)(client))

client.login(TOKEN);
