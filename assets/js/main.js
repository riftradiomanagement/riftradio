// ====== Firebase Config ======
const firebaseConfig = { 
apiKey: "AIzaSyBu7U9DL_eaMd17TqGYBKRs5FYK-qZN3W8", 
authDomain: "riftradio-261b2.firebaseapp.com", 
databaseURL: "https://riftradio-261b2-default-rtdb.firebaseio.com/", 
projectId: "riftradio-261b2", 
storageBucket: "riftradio-261b2.appspot.com", 
messagingSenderId: "1090281308108", 
appId: "1:1090281308108:web:fda907d270875dcb3ae769" 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ============================
   YOUTUBE PLAYER
   ============================ */

const PLAYLIST_ID = "YOUR_PLAYLIST_ID_HERE";

let player = null;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "1",
    width: "1",
    playerVars: {
      listType: "playlist",
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0
    },
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerStateChange(e) {
  const playBtn = document.getElementById("playBtn");
  const title = document.getElementById("trackTitle");
  const cover = document.getElementById("cover");

  if (e.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playBtn.textContent = "❚❚";

    const data = player.getVideoData();
    title.textContent = data.title || "Now Playing";

    cover.style.backgroundImage =
      `url(https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg)`;
  }

  if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    playBtn.textContent = "▶";
  }
}

/* ============================
   DOM READY
   ============================ */

document.addEventListener("DOMContentLoaded", () => {

  /* PLAY BUTTON */
  const playBtn = document.getElementById("playBtn");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (!player) return;
      isPlaying ? player.pauseVideo() : player.playVideo();
    });
  }

  /* STATUS LISTENER */
  const statusText = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");

  db.ref("status").on("value", snap => {
    const data = snap.val();
    if (!data) return;

    statusText.textContent = data.text;
    statusDot.style.background = data.color;
    statusDot.style.boxShadow = `0 0 12px ${data.color}`;

    document.documentElement.style.setProperty("--neon", data.color);
  });

});
