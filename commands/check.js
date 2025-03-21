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
    
    // Calculate total message count
    const totalCount = players.reduce((sum, player) => sum + player.score, 0);
    console.log(`Total message count: ${totalCount}`);
    console.log(`Total unique chatters: ${players.length}`);
    
    // Show average messages per user
    const avgMessages = players.length > 0 ? (totalCount / players.length).toFixed(2) : 0;
    console.log(`Average messages per user: ${avgMessages}`);
    
    updateScore();
  } else if (message === "!stats") {
    // More detailed stats about the chat
    const totalCount = players.reduce((sum, player) => sum + player.score, 0);
    const avgMessages = players.length > 0 ? (totalCount / players.length).toFixed(2) : 0;
    const maxMessages = players.length > 0 ? Math.max(...players.map(p => p.score)) : 0;
    const maxMessagesUser = players.find(p => p.score === maxMessages)?.name || 'none';
    
    console.log(`Chat Stats:
- Total messages: ${totalCount}
- Unique chatters: ${players.length}
- Avg messages per user: ${avgMessages}
- Most active: ${maxMessagesUser} (${maxMessages} messages)
    `);
    
    updateScore();
  }
};