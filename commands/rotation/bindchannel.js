const { Command } = require('discord.js-commando');
const fs = require('fs').promises;
const rotationChannelFileName = 'rotationChannel.json';

module.exports = class RotationBindChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotationbindchannel',
			aliases: ['rbc', 'bc', 'bind'],
			group: 'rotation',
			memberName: 'bindchannel',
			description: 'Bind the payout message to a channel',
      format: '<channel or channelid>',
      examples: ['#payout-channel'],
      guildOnly: true,
			args: [
				{
					key: 'channel',
					prompt: 'Please provide a channel',
					type: 'channel'
				},
			],
		});
	}

	async run(message, { channel }) {
		const channelObject = { channel: channel.id.toString() };
    await fs.writeFile(rotationChannelFileName, JSON.stringify(channelObject, null, 2));
    
    this.client.user.setActivity(`${this.client.commandPrefix}help`);
    this.client.hasRotationChannel = true;
    this.client.rotation.createRotation();
		
		return message.reply(`Payout bound to new channel ${channel}`);
	}
};