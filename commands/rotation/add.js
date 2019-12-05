const { Command } = require('discord.js-commando');
const fs = require('fs').promises;
const rotationFileName = 'rotation.json';

module.exports = class RotationAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotationadd',
			aliases: ['radd', 'ra'],
			group: 'rotation',
			memberName: 'add',
			description: 'Add a player to the rotation.',
      format: '<payout time in utc(4 numbers)> <player name>',
      examples: ['1000 Mol Eliza', '1200 Captain Ahab'],
			args: [
				{
					key: 'payoutTime',
					prompt: 'Please provide a payout time (format: 4 numbers. Example: 1000 for 10:00 UTC)',
					type: 'string',
					validate: text => /\d{4}/.test(text)
				},
				{
					key: 'playerName',
					prompt: 'Please provide the name of the player',
					type: 'string'
				},
			],
		});
	}

	async run(message, { payoutTime, playerName }) {
		if (!this.client.hasRotationChannel) {
			return message.reply(`Error: Please use \`${this.client.commandPrefix}bind\` to bind a channel first. The bot will display rotations there!`);
		}
		let rotationData;
		try {
			rotationData = JSON.parse(await fs.readFile(rotationFileName, 'utf-8'));
		} catch (error) {
			rotationData = {};
		}
		
		if (!rotationData[payoutTime]) {
			rotationData[payoutTime] = [];
		}
		if (rotationData[payoutTime].includes(playerName)) {
			return message.reply(`Player ${playerName} is already in the provided payout time.`);
		}
		rotationData[payoutTime].push(playerName);
		await fs.writeFile(rotationFileName, JSON.stringify(rotationData, null, 2));
		return message.reply(`Player ${playerName} added to payout time ${payoutTime} UTC`);
	}
};