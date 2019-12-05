const cron = require('node-cron');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const rotationFileName = path.join(__dirname, '..', 'rotation.json');
const rotationChannelFileName = path.join(__dirname, '..', 'rotationChannel.json');
const moment = require('moment');
let task;

module.exports = (client) => {  
  async function createRotation() {
    if (!client.hasRotationChannel) {
      return null;
    }

    task = cron.schedule('* * * * *', async function() {
      console.log(rotationFileName);
      let rotationData;
      let rotationChannelData;
      try {
        rotationData = JSON.parse(await fsPromises.readFile(rotationFileName, 'utf-8'));
        rotationChannelData = JSON.parse(await fsPromises.readFile(rotationChannelFileName, 'utf-8'));
        if (!rotationChannelData.channel) {
          throw Error("Rotation channel data is corrupted: Could not find channel id");
        }
      } catch (error) {
        console.log("Could not load rotation file or rotation channel file");
        console.log(error);
        rotationData = {};
      }
      const now = moment.utc();
      const payoutMoment = moment.utc();

      const displayRotation = {};
      for (const payoutTime of Object.keys(rotationData)) {
        const hours = Number(payoutTime.slice(0, 2));
        const minutes = Number(payoutTime.slice(2));

        payoutMoment.set({ hour: hours, minute: minutes });

        const duration = moment.duration(payoutMoment.diff(now));
        let durationInMinutes = Number(duration.asMinutes().toFixed());

        if (durationInMinutes < 0) {
          durationInMinutes += (24 * 60);
        }

        const hoursLeft = Math.floor(durationInMinutes / 60);
        const minutesLeft = durationInMinutes - hoursLeft * 60;
        displayRotation[durationInMinutes] = { hours: hoursLeft, minutes: minutesLeft, players: rotationData[payoutTime] };
      }

      console.log(JSON.stringify(displayRotation));
      const payoutChannel = await client.channels.get(rotationChannelData.channel);
      if (!rotationChannelData.message) {
        const message = await payoutChannel.send(JSON.stringify(displayRotation));
        rotationChannelData.message = message.id.toString();
        console.log(JSON.stringify(rotationChannelData));
        await fsPromises.writeFile(rotationChannelFileName, JSON.stringify(rotationChannelData, null, 2));
      } else {
        const message = await payoutChannel.fetchMessage(rotationChannelData.message);
        await message.edit(JSON.stringify(displayRotation));
      }
//       const rotationsToPrint = await rotationClient.db.getRotationsToPrint();
  //     rotationClient.logger.debug(`new rotations: ${rotationsToPrint.length} rotations to process`);
  //     for (const rotation of rotationsToPrint) {
  //       let webhook;
  //       try {
  //         webhook = new Discord.WebhookClient(rotation.webhookId, rotation.webhookToken);
  //         const newRotation = commonRotation.rotate(rotation.players, rotation.direction);
  //         await webhook.send(commonRotation.getRotation(newRotation));
  //         rotationClient.logger.debug(commonRotation.getRotation(newRotation));
  //         await rotationClient.db.updateRotation(rotation.authorId, rotation.channelId, newRotation);
  //       } catch(error) {
  //         rotationClient.logger.error(error);
  //       } finally {
  //         if (webhook && webhook.destroy) {
  //           webhook.destroy();
  //         }
  //       }
  //     }
    });
  }
  
  return {
    createRotation: createRotation
  };
}