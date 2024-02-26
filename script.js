const player1Name = document.getElementById("player1-Name");
const player2Name = document.getElementById("player2-Name");

const player1Score = document.getElementById("player1-Score");
const player2Score = document.getElementById("player2-Score");

let player1 = "streamelements";
let player2 = "stoney_eagle";

const players = [];

const playersString = localStorage.getItem("players");
console.log(playersString);
if (playersString) {
  const playersArr = JSON.parse(playersString);
  if (Array.isArray(playersArr)) {
    players.push(...playersArr);
  }
  console.log(playersArr);
}

const updateScore = () => {
  players.sort((a, b) => b.score - a.score);
  const chatters = players.slice(0, 2);
  chatters.map((chatter, index) => {
    if (index === 0) {
      player1Name.innerText = chatter.name;
      player1Score.innerText = chatter.score;
    } else {
      player2Name.innerText = chatter.name;
      player2Score.innerText = chatter.score;
    }
  });
};

let isRaiding = false;

const resetInterface = () => {
    player1Name.innerText = "N/A";
    player1Score.innerText = 0;
    player2Name.innerText = "N/A";
    player2Score.innerText = 0;
  };

updateScore();

const check = (tags) => {
  if (isRaiding) return;
  if (players.some((player) => player.user == tags.username)) {
    const player = players.find((player) => player.user == tags.username); 
    player.score += 1;
  } else {
    players.push({
      name: tags["display-name"],
      user: tags.username,
      score: 1,
    });
  }
  localStorage.setItem("players", JSON.stringify(players));
  updateScore();
};

const reset = (tags, message) => {
  if (!tags.badges || !Object.entries(tags.badges).some(([key]) => key === "broadcaster" || key === "moderator")) {
    return;
  }
  if (message === "!raid" || message === "!raid2") {
    localStorage.removeItem("players"); // but not this
    console.log('Local Storage cleared'); // this works
    players.length = 0;
    resetInterface();
    isRaiding = true;
    setTimeout(() => {isRaiding = false;}, 1000)
  }
};

const buttonReset = () => {
  addEventListener("click", this.onclick)
  localStorage.removeItem("players");
  resetInterface();
};

const client = new tmi.Client({
  options: { debug: true },
  channels: ["aaoa_"],
});
client.connect().catch(console.error);
client.on("message", (channel, tags, message, self) => {
  if (self) return;
  check(tags);
  reset(tags, message);
});
