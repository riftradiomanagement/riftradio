// v1.js
// Reserved for future AzuraCast metadata, live song titles, listeners, etc.

const player = document.getElementById("radioPlayer");

player.addEventListener("play", () => {
  console.log("Radio started");
});

player.addEventListener("pause", () => {
  console.log("Radio paused");
});
