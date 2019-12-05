const { Command } = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meow',
			aliases: ['kitty-cat'],
			group: 'basic',
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
// 	    guildOnly: true,
// 	    ownerOnly: true,
//       clientPermissions: ['ADMINISTRATOR'],
//       userPermissions: ['MANAGE_MESSAGES'],
//       throttling: { // 2 usages per 10s
//         usages: 2,
//         duration: 10,
//       },
		});
	}
  
	run(message) {
		return message.say('Meow!');
	}
};