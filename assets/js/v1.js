const player = document.getElementById("radioPlayer");
const playBtn = document.getElementById("playBtn");
const statusText = document.querySelector(".status");

let playing = false;

playBtn.addEventListener("click", () => {
  if (!playing) {
    player.play();
    playBtn.textContent = "❚❚";
    statusText.lastChild.textContent = " Live broadcast";
    playing = true;
  } else {
    player.pause();
    playBtn.textContent = "▶";
    statusText.lastChild.textContent = " Paused";
    playing = false;
  }
});
