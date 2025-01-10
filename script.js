import { commands } from './commands/index.js';

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
    timeout: 10000,
    reconnectInterval: 2000
  },
  channels: ['aaoa_']
});

let connectionAttempts = 0;
const MAX_ATTEMPTS = 5;

const connect = async () => {
  if (connectionAttempts >= MAX_ATTEMPTS) {
    console.error('Max reconnection attempts reached. Please refresh the page.');
    return;
  }

  try {
    await client.connect();
    connectionAttempts = 0; // Reset counter on successful connection
    console.log('Connected to Twitch chat');
  } catch (err) {
    connectionAttempts++;
    console.error(`Connection attempt ${connectionAttempts} failed:`, err.message);
    setTimeout(connect, 2000 * Math.min(connectionAttempts, 5)); // Exponential backoff
  }
};

// Initial connection
connect();

// Connection event handlers
client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
  connectionAttempts = 0;
});

client.on('disconnected', (reason) => {
  console.log('Disconnected:', reason);
  setTimeout(connect, 2000);
});

client.on('connecting', () => {
  console.log('Attempting to connect...');
});

client.on('reconnect', () => {
  console.log('Reconnecting...');
});

// Message handling
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
