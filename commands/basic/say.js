const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['parrot', 'copy'],
			group: 'basic',
			memberName: 'say',
			description: 'Replies with the text you provide.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like the bot to say?',
					type: 'string',
// 					validate: text => text.length < 4,
					oneOf: ['yes', 'no'],
				},
				{
					key: 'otherThing',
					prompt: 'What is this other useless thing?',
					type: 'string',
					default: 'dog'
				},
			],
		});
	}

	run(message, { text, otherThing }) {
		return message.reply(`${text}/${otherThing}`);
	}
};