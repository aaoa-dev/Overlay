import {players} from './players.js';

const p1Name = document.getElementById("p1-Name");
const p2Name = document.getElementById("p2-Name");
const p3Name = document.getElementById("p3-Name");
const p1Score = document.getElementById("p1-Score");
const p2Score = document.getElementById("p2-Score");
const p3Score = document.getElementById("p3-Score");

export const updateScore = () => {
  players.sort((a, b) => b.score - a.score);
  const topThree = players.slice(0, 3);
  
  // Reset all displays first
  [p1Name, p2Name, p3Name].forEach(el => el.innerText = "N/A");
  [p1Score, p2Score, p3Score].forEach(el => el.innerText = "0");

  // Update with available players
  topThree.forEach((chatter, index) => {
    const elements = [
      [p1Name, p1Score],
      [p2Name, p2Score],
      [p3Name, p3Score]
    ][index];

    if (elements) {
      const [nameEl, scoreEl] = elements;
      nameEl.innerText = chatter.name;
      scoreEl.innerText = chatter.score;
    }
  });
};

updateScore();

export const resetUI = () => {
  [p1Name, p2Name, p3Name].forEach(el => el.innerText = "N/A");
  [p1Score, p2Score, p3Score].forEach(el => el.innerText = "0");
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