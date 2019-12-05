const { Command } = require('discord.js-commando');
const fs = require('fs').promises;
const rotationFileName = 'rotation.json';

module.exports = class RotationRemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotationremove',
			aliases: ['rremove', 'rrem', 'rr'],
			group: 'rotation',
			memberName: 'remove',
			description: 'Remove a player from the payout.',
      format: '<payout time in utc(4 numbers)> <Position of the player>',
      examples: ['1000 1', '1200 3'],
			args: [
				{
					key: 'payoutTime',
					prompt: 'Please provide a payout time (format: 4 numbers. Example: 1000 for 10:00 UTC)',
					type: 'string',
					validate: text => /\d{4}/.test(text)
				},
				{
					key: 'position',
					prompt: 'Please provide the position of the player to remove',
					type: 'integer',
          min: 1
				},
			],
		});
	}

	async run(message, { payoutTime, position }) {
    if (!this.client.hasRotationChannel) {
			return message.reply(`Error: Please use \`${this.client.commandPrefix}bind\` to bind a channel first. The bot will display rotations there!`);
		}
    position--;
		let rotationData;

		try {
			rotationData = JSON.parse(await fs.readFile(rotationFileName, 'utf-8'));
		} catch (error) {
			return message.reply(`Your rotation has not been initialized!`);
		}
		
		if (!rotationData[payoutTime]) {
			return message.reply(`Could not find the provided payout time..`);
		}
    
    if (rotationData[payoutTime].length < position) {
      return message.reply(`This payout has less than ${position+1} players.. Please provide a number between 1 and ${rotationData[payoutTime].length}`);
    }
    
    const removedPlayer = rotationData[payoutTime].splice(position, 1);
    
		if (!rotationData[payoutTime].length) {
      delete rotationData[payoutTime];
		}
    
		await fs.writeFile(rotationFileName, JSON.stringify(rotationData, null, 2));
		return message.reply(`Player ${removedPlayer[0]} removed from payout time ${payoutTime} UTC`);
	}
};