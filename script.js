const player1Name = document.getElementById("player1-Name");
const player2Name = document.getElementById("player2-Name");

const player1Score = document.getElementById("player1-Score");
const player2Score = document.getElementById("player2-Score");

let player1 = "streamelements";
let player2 = "stoney_eagle";

const players = [
  {
    name: "StreamElements",
    user: "streamelements",
    score: 0,
  },
  {
    name: "Stoney_Eagle",
    user: "stoney_eagle",
    score: 0,
  },
  {
    name: "aaoa_",
    user: "aaoa_",
    score: 0,
  },
];

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

const check = (username) => {
  const player = players.find((player) => player.user == username);
  if (player) {
    player.score += 1;
  }
  updateScore();
};

const client = new tmi.Client({
  options: { debug: true },
  channels: ["aaoa_"],
});
client.connect().catch(console.error);
client.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (tags.username === player1 || tags.username === player2) {
    check(tags.username); // new function check
  }
});

// function playerCheck(tags.username) {

// }
