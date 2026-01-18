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
let player, isPlaying = false;

// DEFAULT PLACEHOLDER
let playlistId = "YOUR_PLAYLIST_ID_HERE";

/* ===== YOUTUBE ===== */
function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "1",
    width: "1",
    playerVars: {
      listType: "playlist",
      list: playlistId,
      controls: 0
    },
    events: { onStateChange }
  });
}

function onStateChange(e) {
  const title = document.getElementById("trackTitle");
  const cover = document.getElementById("cover");
  const playBtn = document.getElementById("playBtn");

  if (e.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playBtn.textContent = "❚❚";

    const data = player.getVideoData();
    title.textContent = data.title;

    cover.style.backgroundImage =
      `url(https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg)`;
  }

  if (e.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    playBtn.textContent = "▶";
  }
}

/* ===== PLAY BUTTON ===== */
document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  if (playBtn) {
    playBtn.onclick = () =>
      isPlaying ? player.pauseVideo() : player.playVideo();
  }

  /* ===== STATUS SYNC ===== */
  db.ref("status").on("value", s => {
    const d = s.val();
    if (!d) return;
    statusText.textContent = d.text;
    statusDot.style.background = d.color;
    statusDot.style.boxShadow = `0 0 12px ${d.color}`;
  });

  setupAdmin();
  setupKeyboard();
});

/* ===== KEYBOARD SHORTCUTS ===== */
function setupKeyboard() {
  document.addEventListener("keydown", e => {
    if (e.code === "Space") {
      e.preventDefault();
      isPlaying ? player.pauseVideo() : player.playVideo();
    }
    if (e.code === "ArrowRight") {
      player.nextVideo();
    }
  });
}

/* ===== ADMIN ===== */
function setupAdmin() {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return;

  loginBtn.onclick = async () => {
    const pass = adminPassword.value;
    const snap = await db.ref("status/adminKey").get();
    if (snap.val() === pass) alert("Admin unlocked");
  };

  updateStatusBtn.onclick = () => {
    const text =
      statusPreset.value === "custom"
        ? customStatus.value
        : statusPreset.value;

    db.ref("status").update({
      text,
      color: statusColor.value
    });
  };

  updatePlaylistBtn.onclick = () => {
    playlistId = playlistInput.value;
    db.ref("playlist").set({ id: playlistId });
    location.reload();
  };
