import {players} from './players.js';
import {updateScore} from './reset.js';

export const check = (tags, message) => {
  if (!tags.badges || !Object.entries(tags.badges).some(([key]) => key === "broadcaster" || key === "moderator")) {
    return;
  }
  if (message === "!check") {
    console.log('Current Players:', players);
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const topThree = sortedPlayers.slice(0, 3);
    
    console.log('Top 3 Players:');
    topThree.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name}: ${player.score}`);
    });
    
    updateScore();
  }
};