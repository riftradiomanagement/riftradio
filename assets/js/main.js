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

/* ========== SHARED STATE ========== */

let player = null;
let isPlaying = false;

/* ========== YOUTUBE PLAYER ========== */

function onYouTubeIframeAPIReady() {
  const ytContainer = document.getElementById("yt-player");
  if (!ytContainer) return; // admin page safety

  player = new YT.Player("yt-player", {
    height: "1",
    width: "1",
    playerVars: {
      listType: "playlist",
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      fs: 0
    },
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  const playBtn = document.getElementById("playBtn");
  const titleEl = document.getElementById("trackTitle");

  if (!playBtn || !titleEl) return;

  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playBtn.textContent = "❚❚";
    titleEl.textContent =
      player.getVideoData().title || "Now Playing";
  }

  if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    playBtn.textContent = "▶";
  }

  if (event.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    playBtn.textContent = "▶";
  }
}

/* ========== MAIN PAGE UI ========== */

document.addEventListener("DOMContentLoaded", () => {

  /* --- Play Button --- */
  const playBtn = document.getElementById("playBtn");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (!player) return;
      isPlaying ? player.pauseVideo() : player.playVideo();
    });
  }

  /* --- STATUS LISTENER --- */
  const statusText = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");

  if (statusText && statusDot) {
    db.ref("status").on("value", snap => {
      const data = snap.val();
      if (!data) return;

      statusText.textContent = data.text;
      statusDot.style.background = data.color;
      statusDot.style.boxShadow = `0 0 15px ${data.color}`;
    });
  }

  /* --- ADMIN PAGE LOGIC --- */
  setupAdminPanel();

});

/* ========== ADMIN PANEL ========== */

function setupAdminPanel() {

  const passwordInput = document.getElementById("adminPassword");
  const loginBtn = document.getElementById("loginBtn");
  if (!passwordInput || !loginBtn) return; // not admin page

  const statusPreset = document.getElementById("statusPreset");
  const customStatus = document.getElementById("customStatus");
  const statusColor = document.getElementById("statusColor");
  const updateBtn = document.getElementById("updateStatusBtn");

  let authenticated = false;

  /* --- LOGIN --- */
  loginBtn.addEventListener("click", async () => {
    const entered = passwordInput.value;

    const snap = await db.ref("status/adminKey").get();
    if (snap.val() === entered) {
      authenticated = true;
      document.body.classList.add("admin-auth");
      alert("Admin access granted");
    } else {
      alert("Incorrect password");
    }
  });

  /* --- UPDATE STATUS --- */
  updateBtn.addEventListener("click", () => {
    if (!authenticated) {
      alert("Not authenticated");
      return;
    }

    let text =
      statusPreset.value === "custom"
        ? customStatus.value
        : statusPreset.value;

    if (!text) text = "Live";

    db.ref("status").update({
      text,
      color: statusColor.value
    });
  });
}
