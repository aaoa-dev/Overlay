import {reset, check} from './commands/index.js';


// Manual reset if Raid fail
// const manualReset = () =>
// {localStorage.removeItem("players");
//  console.log('Local Storage cleared');
//  players.length = 0;
//  resetUI();
// };

// manualReset();

// const buttonReset = () => {
//   addEventListener("click", this.onclick)
//   localStorage.removeItem("players"); // but not this
//   console.log('Local Storage cleared'); // this works
//   players.length = 0;
//   resetUI();
// };

//This is TMI stuff that check message and act accordingly
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
