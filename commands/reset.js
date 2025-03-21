import {players} from './players.js';

const p1Name = document.getElementById("p1-Name");
const p2Name = document.getElementById("p2-Name");
const p3Name = document.getElementById("p3-Name");
const p1Score = document.getElementById("p1-Score");
const p2Score = document.getElementById("p2-Score");
const p3Score = document.getElementById("p3-Score");
const p1Avatar = document.getElementById("p1-Avatar");
const p2Avatar = document.getElementById("p2-Avatar");
const p3Avatar = document.getElementById("p3-Avatar");

function getColorFromUsername(username) {
  // Simple hash function to generate a color
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert to RGB
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;
  return `rgb(${r}, ${g}, ${b})`;
}

export const updateScore = () => {
  players.sort((a, b) => b.score - a.score);
  const topThree = players.slice(0, 3);
  
  // Reset all displays first
  [p1Name, p2Name, p3Name].forEach(el => el.innerText = "N/A");
  [p1Score, p2Score, p3Score].forEach(el => el.innerText = "0");
  [p1Avatar, p2Avatar, p3Avatar].forEach(el => {
    el.innerText = "";
    el.style.backgroundColor = "#4c1d95"; // Default violet color
  });

  // Update with available players
  topThree.forEach((chatter, index) => {
    const elements = [
      [p1Name, p1Score, p1Avatar],
      [p2Name, p2Score, p2Avatar],
      [p3Name, p3Score, p3Avatar]
    ][index];

    if (elements) {
      const [nameEl, scoreEl, avatarEl] = elements;
      nameEl.innerText = chatter.name;
      scoreEl.innerText = chatter.score;
      avatarEl.innerText = chatter.name[0].toUpperCase();
      avatarEl.style.backgroundColor = getColorFromUsername(chatter.user);
    }
  });
};

updateScore();

export const resetUI = () => {
  [p1Name, p2Name, p3Name].forEach(el => el.innerText = "N/A");
  [p1Score, p2Score, p3Score].forEach(el => el.innerText = "0");
  [p1Avatar, p2Avatar, p3Avatar].forEach(el => {
    el.innerText = "";
    el.style.backgroundColor = "#4c1d95"; // Default violet color
  });
};

export let isRaiding = false;

// Will signal all modules to reset tracking data
export const resetCountData = () => {
  // This is a signal function that other modules can import
  console.log('Resetting all tracking data');
  // This function intentionally left mostly empty - 
  // modules that need to reset their state should watch for the isRaiding flag
};

export const reset = (tags, message) => {
  if (!tags.badges || !Object.entries(tags.badges).some(([key]) => key === "broadcaster" || key === "moderator")) {
    return;
  }
  if (message === "!reset") {
    localStorage.removeItem("players"); 
    console.log('Local Storage cleared'); 
    players.length = 0;
    resetUI();
    isRaiding = true;
    resetCountData(); // Signal to reset all tracking data
    console.log('All data reset. Raid mode activated for 10 seconds.');
    setTimeout(() => {
      isRaiding = false;
      console.log('Raid mode deactivated. Message counting resumed.');
    }, 10000);
  }
};