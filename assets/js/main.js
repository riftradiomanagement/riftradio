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
  // --------------------
  // MAIN PAGE PLAYER
  // --------------------
  const player = document.getElementById("radioPlayer");
  const playBtn = document.getElementById("playBtn");
  let playing = false;

  if(playBtn && player){
    playBtn.addEventListener("click", () => {
      if(!playing){
        player.play();
        playBtn.textContent = "❚❚";
        playing = true;
      } else {
        player.pause();
        playBtn.textContent = "▶";
        playing = false;
      }
    });
  }

  // --------------------
  // GLOBAL STATUS
  // --------------------
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");

  if(statusDot && statusText){
    db.ref("status").on("value", snapshot => {
      const data = snapshot.val();
      if(data){
        const { text, color } = data;
        statusText.textContent = text;
        statusDot.style.backgroundColor = color;
        statusDot.style.boxShadow = `0 0 12px ${color}`;

        // Update neon color for other elements
        document.documentElement.style.setProperty('--neon-color', color);
      }
    });
  }

  // --------------------
  // ADMIN PANEL
  // --------------------
  const adminPanel = document.getElementById("adminPanel");
  if(adminPanel){
    function askAdminKey(){
      const key = prompt("Enter Admin Key:");
      if(key === null) return; // user cancelled

      db.ref("status/adminKey").once("value").then(snap => {
        const correctKey = snap.val();
        if(key === correctKey){
          adminPanel.style.display = "block"; // show panel
          setupAdminControls();
        } else {
          alert("Incorrect key");
          askAdminKey(); // retry
        }
      });
    }

    function setupAdminControls(){
      const presetSelect = document.getElementById("presetStatus");
      const customStatus = document.getElementById("customStatus");
      const customColor = document.getElementById("customColor");
      const saveBtn = document.getElementById("saveStatus");

      saveBtn.addEventListener("click", () => {
        let text, color;

        if(presetSelect.value){
          [text, color] = presetSelect.value.split("|");
        } else if(customStatus.value){
          text = customStatus.value;
          color = customColor.value;
        } else {
          alert("Please select or enter a status");
          return;
        }

        db.ref("status").update({ text, color });
        alert(`Status updated: ${text}`);
      });
    }

    askAdminKey();
  }
});
