import { commands } from './commands/index.js';

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
    maxReconnectAttempts: 3,
    maxReconnectInterval: 10000,
    reconnectDecay: 1.5
  },
  channels: ['anatoleayadi']
});

// Connection handling
const connectWithRetry = async () => {
  try {
    await client.connect();
    console.log('Successfully connected to Twitch');
  } catch (error) {
    console.error('Failed to connect:', error.message);
    // Try to reconnect after 5 seconds
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

client.on('disconnected', (reason) => {
  console.log('Disconnected from Twitch:', reason);
  connectWithRetry();
});

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
