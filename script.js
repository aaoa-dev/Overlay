import { commands } from './commands/index.js';
import { config } from './config.js';

// Sanitize config values
if (!config.settings?.TWITCH?.USERNAME || 
    !config.settings?.TWITCH?.OAUTH_TOKEN || 
    !config.settings?.TWITCH?.CHANNEL_NAME) {
    throw new Error('Missing required Twitch configuration. Please check your config.js file.');
}

if (!config.settings.TWITCH.OAUTH_TOKEN.startsWith('oauth:')) {
    throw new Error('Invalid OAuth token format. Token must start with "oauth:"');
}

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
        timeout: 10000,
        reconnectInterval: 2000
    },
    options: { 
        debug: true, 
    },
    identity: {
        username: config.settings.TWITCH.USERNAME,
        password: config.settings.TWITCH.OAUTH_TOKEN
    },
    channels: [config.settings.TWITCH.CHANNEL_NAME]
});

let connectionAttempts = 0;
const MAX_ATTEMPTS = 5;
const COMMAND_COOLDOWN = 1000; // 1 second cooldown between commands
let lastCommandTime = 0;

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
        // Sanitize error message to prevent token exposure
        const safeError = err.message.replace(new RegExp(config.settings.TWITCH.OAUTH_TOKEN, 'g'), '[REDACTED]');
        console.error(`Connection attempt ${connectionAttempts} failed:`, safeError);
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
    // Sanitize disconnection reason to prevent token exposure
    const safeReason = reason.replace(new RegExp(config.settings.TWITCH.OAUTH_TOKEN, 'g'), '[REDACTED]');
    console.log('Disconnected:', safeReason);
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
        const now = Date.now();
        
        // Handle commands
        if (message.startsWith('!')) {
            // Rate limiting for commands
            if (now - lastCommandTime < COMMAND_COOLDOWN) {
                return;
            }
            
            const command = message.slice(1).split(' ')[0].toLowerCase(); // Normalize command
            if (commands[command]) {
                lastCommandTime = now;
                commands[command](tags, message, client);
            }
        } else {
            // Count regular messages - REMOVED FROM HERE
            // commands.count(tags);
        }
    } catch (error) {
        // Sanitize error message
        const safeError = error.message.replace(new RegExp(config.settings.TWITCH.OAUTH_TOKEN, 'g'), '[REDACTED]');
        console.error('Error processing message:', safeError);
    }
});

// Add a separate handler specifically for chat messages to avoid duplicate counting
client.on('chat', (channel, tags, message, self) => {
    if (self) return;
    
    // Only count actual chat messages (not actions, whispers, etc.)
    if (tags['message-type'] === 'chat') {
        commands.count(tags);
    }
});
