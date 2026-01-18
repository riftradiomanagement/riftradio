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

document.addEventListener("DOMContentLoaded", () => {
  // -------------------- RADIO PLAYER --------------------
  const player = document.getElementById("radioPlayer");
  const playBtn = document.getElementById("playBtn");
  let playing=false;

  if(playBtn && player){
    playBtn.addEventListener("click", () => {
      if(!playing){ player.play(); playBtn.textContent="❚❚"; playing=true; }
      else { player.pause(); playBtn.textContent="▶"; playing=false; }
    });
  }

  // -------------------- STATUS --------------------
  const statusDot=document.getElementById("statusDot");
  const statusText=document.getElementById("statusText");

  if(statusDot && statusText){
    db.ref("status").on("value", snap => {
      const data=snap.val();
      if(data){
        const { text, color } = data;
        statusText.textContent=text;
        statusDot.style.backgroundColor=color;
        statusDot.style.boxShadow=`0 0 12px ${color}`;
        document.documentElement.style.setProperty('--neon-color', color);
      }
    });
  }

  // -------------------- SPOTIFY PLAYER --------------------
  const spotifyPlayBtn = document.getElementById("spotifyPlayBtn");
  const trackTitle = document.getElementById("trackTitle");
  const trackArtist = document.getElementById("trackArtist");
  const coverArt = document.getElementById("coverArt");

  // Fake audio object for demonstration (replace with actual Spotify Web Playback SDK if desired)
  const spotifyPlayer = new Audio();
  
  // Listen for track updates from Firebase
  db.ref("spotify/currentTrack").on("value", snap=>{
    const data = snap.val();
    if(data){
      trackTitle.textContent = data.song;
      trackArtist.textContent = data.artist;
      coverArt.style.backgroundImage = `url(${data.cover})`;

      spotifyPlayer.src = data.audioSrc || ""; // optional: custom audio file

      if(data.playing) { spotifyPlayer.play(); spotifyPlayBtn.textContent="❚❚"; }
      else { spotifyPlayer.pause(); spotifyPlayBtn.textContent="▶"; }
    }
  });

  // Play/pause button updates Firebase
  if(spotifyPlayBtn){
    spotifyPlayBtn.addEventListener("click", ()=>{
      db.ref("spotify/currentTrack").once("value").then(snap=>{
        const data=snap.val();
        db.ref("spotify/currentTrack").update({ playing: !data.playing });
      });
    });
  }

  // -------------------- ADMIN PANEL --------------------
  const adminPanel=document.getElementById("adminPanel");
  if(adminPanel){
    function askAdminKey(){
      const key = prompt("Enter Admin Key:");
      if(key===null) return;

      db.ref("status/adminKey").once("value").then(snap=>{
        if(key===snap.val()){ adminPanel.style.display="block"; setupAdminControls(); }
        else{ alert("Incorrect key"); askAdminKey(); }
      });
    }

    function setupAdminControls(){
      const presetSelect=document.getElementById("presetStatus");
      const customStatus=document.getElementById("customStatus");
      const customColor=document.getElementById("customColor");
      const saveBtn=document.getElementById("saveStatus");

      saveBtn.addEventListener("click", ()=>{
        let text,color;
        if(presetSelect.value){ [text,color]=presetSelect.value.split("|"); }
        else if(customStatus.value){ text=customStatus.value; color=customColor.value; }
        else{ alert("Select or enter status"); return; }
        db.ref("status").update({ text,color });
        alert(`Status updated: ${text}`);
      });

      // Spotify controls
      const trackName=document.getElementById("trackName");
      const trackArtist=document.getElementById("trackArtist");
      const trackCover=document.getElementById("trackCover");
      const saveTrack=document.getElementById("saveTrack");
      const togglePlay=document.getElementById("togglePlay");

      saveTrack.addEventListener("click", ()=>{
        const song=trackName.value || "Unknown Song";
        const artist=trackArtist.value || "Unknown Artist";
        const cover=trackCover.value || "";
        db.ref("spotify/currentTrack").update({ song, artist, cover });
        alert("Spotify track updated!");
      });

      togglePlay.addEventListener("click", ()=>{
        db.ref("spotify/currentTrack").once("value").then(snap=>{
          const data=snap.val();
          db.ref("spotify/currentTrack").update({ playing: !data.playing });
        });
      });
    }

    askAdminKey();
  }
});
