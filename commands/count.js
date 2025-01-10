import { players } from './players.js';
import { updateScore, isRaiding } from './reset.js';

export const count = (tags) => {
    if (!tags || !tags.username || isRaiding) return;
    
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