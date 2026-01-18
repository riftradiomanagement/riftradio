// ====== Firebase Config ======
const firebaseConfig = {
  apiKey: "AIzaSyBu7U9DL_eaMd17TqGYBKRs5FYK-qZN3W8",
  authDomain: "riftradio-261b2.firebaseapp.com",
  databaseURL: "https://riftradio-261b2.firebaseio.com",
  projectId: "riftradio-261b2",
  storageBucket: "riftradio-261b2.appspot.com",
  messagingSenderId: "1090281308108",
  appId: "1:1090281308108:web:fda907d270875dcb3ae769"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elements
const player = document.getElementById("radioPlayer");
const playBtn = document.getElementById("playBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// Play/Pause
let playing=false;
playBtn.addEventListener("click",()=>{
  if(!playing){player.play();playBtn.textContent="❚❚";playing=true;}
  else{player.pause();playBtn.textContent="▶";playing=false;}
});

// Listen for global status changes
db.ref("status").on("value", snapshot=>{
  const data = snapshot.val();
  if(data){
    const {text,color} = data;
    if(statusText){statusText.textContent=text;}
    if(statusDot){statusDot.style.backgroundColor=color;statusDot.style.boxShadow=`0 0 12px ${color}`;}
    document.documentElement.style.setProperty('--neon-color',color);
  }
});

// Admin Panel
if(document.getElementById("adminPanel")){
  function showAdminPanel(){
    const key = prompt("Enter Admin Key:");
    if(key===null) return;
    db.ref("status/adminKey").once("value").then(snap=>{
      if(key===snap.val()){
        document.getElementById("adminPanel").style.display="block";
        setupAdminControls();
      } else { alert("Incorrect key"); showAdminPanel(); }
    });
  }
  showAdminPanel();

  function setupAdminControls(){
    const presetSelect=document.getElementById("presetStatus");
    const customStatus=document.getElementById("customStatus");
    const customColor=document.getElementById("customColor");
    const saveBtn=document.getElementById("saveStatus");

    saveBtn.addEventListener("click",()=>{
      let text,color;
      if(presetSelect.value){[text,color]=presetSelect.value.split("|");}
      else if(customStatus.value){text=customStatus.value;color=customColor.value;}
      else{alert("Select or enter status");return;}
      db.ref("status").update({text,color});
      alert(`Status updated: ${text}`);
    });
  }
}
