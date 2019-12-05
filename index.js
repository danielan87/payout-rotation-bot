const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const botConfig = require('./config.json');
const fs = require('fs');
let rotationChannel;
try {
  rotationChannel = JSON.parse(fs.readFileSync('./rotationChannel.json', 'utf-8'));
} catch (error) {
}
// https://discordapp.com/oauth2/authorize?client_id=%20651881773659062295&scope=bot&permissions=519232

// const client = new CommandoClient({
// 	commandPrefix: botConfig.commandPrefix,
// 	owner: botConfig.owner,
// 	invite: botConfig.invite,
// });

const commandPrefix = process.env.commandPrefix || "?";
const client = new CommandoClient({
	commandPrefix: commandPrefix,
	owner: process.env.owner,
	invite: botConfig.invite,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['basic', 'Basic commands'],
    ['rotation', 'Rotation commands']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
//     help: false
  })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.rotation = require('./scripts/rotation.js')(client);

const activity = rotationChannel ? `Error: use ${commandPrefix}bind to bind a channel` : `${commandPrefix}help`;

client.hasRotationChannel = !!rotationChannel;

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(activity);
});

client.on('error', console.error);

client.login(process.env.botToken);

if (rotationChannel) {
	client.rotation.createRotation();
}