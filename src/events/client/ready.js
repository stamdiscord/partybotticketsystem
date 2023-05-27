const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = async (client) => {
	console.log(`${client.user.username} is online! Hosting ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    //Register slash commands
    process.stdout.write("Start to register slash commands... ");
    await registerCommands(client);
    console.log("Done!");
}


function registerCommands(client){
    new Promise(resolve =>{
        const rest = new REST({
            version: "9"
        }).setToken(process.env.token);
        (async () => {
            try {

                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, "813844220694757447"), { body: client.commandArray }
                )
            

                await rest.put(
                    Routes.applicationCommands(client.user.id),{body:client.commandArray}
                )
            
                resolve();
            } catch (err) {
                console.log("Error:");
                console.log(err)
            }
        })();
    })
}
