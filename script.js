import { commands } from './commands/index.js';

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: ['anatoleayadi']
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  try {
    // Handle commands
    if (message.startsWith('!')) {
      const command = message.slice(1).split(' ')[0];
      if (commands[command]) {
        commands[command](tags, message);
      }
    } else {
      // Count regular messages
      commands.count(tags);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});
