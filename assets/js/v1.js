const player = document.getElementById("radioPlayer");
const playBtn = document.getElementById("playBtn");
const playState = document.getElementById("playState");
const trackTitle = document.getElementById("trackTitle");
const listenerCount = document.getElementById("listenerCount");

let playing = false;

/* =====================
   PLAY / PAUSE
===================== */
playBtn.addEventListener("click", () => {
  if (!playing) {
    player.play();
    playBtn.textContent = "❚❚";
    playState.textContent = "Live";
    playing = true;
  } else {
    player.pause();
    playBtn.textContent = "▶";
    playState.textContent = "Paused";
    playing = false;
  }
});

/* =====================
   AZURACAST API
===================== */
/*
  Replace BASE_URL with your AzuraCast URL later
  Example: https://radio.example.com
*/
const BASE_URL = "https://YOUR_AZURACAST_URL";
const STATION_ID = 1;

async function fetchNowPlaying() {
  try {
    const res = await fetch(`${BASE_URL}/api/nowplaying/${STATION_ID}`);
    const data = await res.json();

    trackTitle.textContent =
      data.now_playing.song.text || "Live broadcast";

    listenerCount.textContent =
      data.listeners.total || 0;
  } catch (err) {
    trackTitle.textContent = "Offline";
  }
}

// Update every 15 seconds
setInterval(fetchNowPlaying, 15000);
fetchNowPlaying();
