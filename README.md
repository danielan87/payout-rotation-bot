# Payout Rotation Bot

This little tool will help you track upcoming payouts for your shard. It is independent of any games.

## Creating a bot on discord
1) Head over to https://discordapp.com/developers/applications
2) Login, then click on "New Application"
3) Choose a name then click on "Create"
4) In the menu, go in the "Bot" Section then click on "Add Bot" then "Yes, do it!"
5) Your bot is ready! You will notice that a token is now available. This token is a code unique to your bot. Do to share it with anyone! This token will be needed in the second part.

## Installation
1) Click on the button below
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
2) Choose a unique name then click on "Deploy App"
3) Once deployed, click on "Manage App"
4) In the Settings tab, Click "Reveal Config Vars" and add the following variables

| Key | Value | Required |
| ------ | ------ | ------ |
| **botToken** | *Available on https://discordapp.com/developers/applications/me* | ✓ |
| **owner** | *Your Discord ID (18 digits)* | ✓ |
| **commandPrefix** | *Prefix for your bot. Default: "?"* | ✘ |
5) Under Resources, deactivate `web npm start` and activate `worker npm start`
6) On the upper right corner, click on "More" > "Run Console"
7) In the pop-up, type `bash` then click on "Run"
8) Once `~ $` appears, type `npm install` then hit Enter
9) Upon completion, you can close the pop-up.
10) Click on "More" > "Restart all dynos"
11) To make sure your bot is up and running, click on "More" > "View logs". You should see `Logged in as <Your bot's name> (Your bot's id)`

*NB: feel free to fork this repo to activate automatic deployments. You will need to handle the updates on your fork yourself!*

## Usage
1) Now that it's running, you need to invite it to your shard! Modify and use the link below:
`https://discordapp.com/oauth2/authorize?client_id=<Your bot's client id>&scope=bot&permissions=519232`
2) The first thing you want to do is to bind a channel. This channel will be used to display the payout. In your server, create a new channel (for this example I am calling it "payout"). Make sure the bot has read/write access on that channel! Assuming you didn't change the prefix, use: `?bind #payout` (change the prefix and the name of the channel accordingly). **Note that you can only bind ONE channel! This bot will not work on multiple shards! You will need to create a separate one**
3) Now all that is left is to add players! Assuming you want to add a player named "Captain Ahab" at 10pm UTC, type `?rotationadd 2200 Captain Ahab`. You can also type `radd 2200 Captain Ahab` or `ra 2200 Captain Ahab`. The time will always be in **UTC Military time!** So if your payout is at 6pm EST, you should convert it to UTC first (11pm -> 2300).
4) To remove a player, use the `rotationremove` command. For example, say at payout 2200 we have 3 players, Captain Ahab, Moby Dick and Herman Melville in that order. you want to type `rotationremove 2200 1` (1 is the position of the player on the list!). You can also type `rremove`, `rrem` or `rr`.


Please report any bug and suggestions to me on discord: JubeiNabeshin#8860 (you can find me on https://discord.gg/bRCvFy9)