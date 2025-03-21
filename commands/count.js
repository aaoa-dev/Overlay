import { players } from './players.js';
import { updateScore, isRaiding, resetCountData } from './reset.js';

// Track the last message time per user to prevent duplicate counts
const lastMessageTimes = {};
const MESSAGE_COOLDOWN = 500; // 500ms cooldown between messages from same user

// Function to clear the message time tracking data
export const clearMessageTimes = () => {
    Object.keys(lastMessageTimes).forEach(key => delete lastMessageTimes[key]);
    console.log('Message tracking data cleared');
};

// Listen for resetCountData signal
document.addEventListener('DOMContentLoaded', () => {
    // Hook up to reset events
    const originalResetCountData = resetCountData;
    // We can't directly modify the imported function, but we can clear our data when isRaiding changes
    setInterval(() => {
        if (isRaiding) {
            clearMessageTimes();
        }
    }, 1000);
});

export const count = (tags) => {
    // Skip if missing required data, during raid mode, or not a chat message
    if (!tags || !tags.username || isRaiding || tags['message-type'] !== 'chat') return;
    
    // Basic duplicate prevention by timing
    const now = Date.now();
    const lastTime = lastMessageTimes[tags.username] || 0;
    
    // Skip if message from this user was counted very recently (potential duplicate)
    if (now - lastTime < MESSAGE_COOLDOWN) {
        return;
    }
    
    // Update last message time for this user
    lastMessageTimes[tags.username] = now;
    
    try {
        const existingPlayer = players.find((player) => player.user === tags.username);
        
        if (existingPlayer) {
            existingPlayer.score += 1;
        } else {
            players.push({
                name: tags["display-name"] || tags.username,
                user: tags.username,
                score: 1,
            });
        }
        
        // Persist to localStorage
        try {
            localStorage.setItem("players", JSON.stringify(players));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
        
        // Update the display
        updateScore();
    } catch (error) {
        console.error('Error in count function:', error);
    }
}; 