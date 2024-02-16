const player1Score = document.getElementById("player1-Score");
const player2Score = document.getElementById("player2-Score");
let player1 = "streamelements";
let player2 = "stoney_eagle";
let p1Score = 0;
let p2Score = 0;

const incrementScore = (player) => {
  if (player === player1) {
    p1Score += 1;
    player1Score.innerText = p1Score;
  } else {
    p2Score += 1;
    player2Score.innerText = p2Score;
  }
};

setTimeout(() => {
  incrementScore(player2);
}, 3000);

const client = new tmi.Client({
  options: { debug: true },
  //   identity: {
  //     username: "bot_name",
  //     password: "oauth:my_bot_token",
  //   },
  channels: ["aaoa_"],
});
client.connect().catch(console.error);
client.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (tags.username === player1 || tags.username === player2) {
    incrementScore(tags.username);
  }
});
