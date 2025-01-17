import { players } from './players.js';

// Rate limiting
const COOLDOWN_TIME = 30000; // 30 seconds
let lastUsed = 0;

export const leaderboard = (tags, message, client) => {
    // Check if command is on cooldown
    const now = Date.now();
    if (now - lastUsed < COOLDOWN_TIME) {
        // Only respond to mods/broadcaster during cooldown
        if (!tags.badges || !Object.entries(tags.badges).some(([key]) => key === "broadcaster" || key === "moderator")) {
            return;
        }
    }
    
    try {
        // Sort players by score in descending order
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        const topThree = sortedPlayers.slice(0, 3);
        
        // Format message
        let response = 'Chat Battle Score: ';
        
        // Add players in reverse order (3rd, 2nd, 1st)
        for (let i = 2; i >= 0; i--) {
            const player = topThree[i];
            if (player) {
                response += `${i + 1}${getOrdinalSuffix(i + 1)} place ${player.score} ${player.name}`;
                if (i > 0) response += ' | ';
            }
        }
        
        // Update cooldown timestamp
        lastUsed = now;
        
        // Send message to chat
        client.say('#' + tags["room-id"], response)
            .catch(error => {
                console.error('Error sending leaderboard message:', error.message);
            });
    } catch (error) {
        console.error('Error in leaderboard command:', error.message);
    }
};

function getOrdinalSuffix(i) {
    const j = i % 10,
          k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
} 