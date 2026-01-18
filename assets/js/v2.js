// ====== Firebase Config ======
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ====== Initialize Firebase ======
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ====== Elements ======
const player = document.getElementById("radioPlayer");
const playBtn = document.getElementById("playBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// ====== Light/Dark mode toggle ======
function toggleTheme() {
  const body = document.body;
  body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
}
document.addEventListener("keydown",(e)=>{
  if(e.key==="l"||e.key==="L") toggleTheme();
});

// ====== Play/Pause ======
let playing=false;
playBtn.addEventListener("click",()=>{
  if(!playing){player.play();playBtn.textContent="❚❚";playing=true;}
  else{player.pause();playBtn.textContent="▶";playing=false;}
});

// ====== Listen for status changes ======
db.ref("status").on("value", snapshot => {
  const data = snapshot.val();
  if(data){
    const {text,color} = data;
    statusText.textContent=text;
    statusDot.style.backgroundColor=color;
    statusDot.style.boxShadow=`0 0 12px ${color}`;

    // Update neon color for all glowing elements
    document.documentElement.style.setProperty('--neon-color', color);
  }
});

// ====== Admin Authentication & Panel ======
if(document.getElementById("adminPanel")){
  let entered=false;
  while(!entered){
    const key = prompt("Enter Admin Key:");
    if(key===null) break;
    db.ref("status/adminKey").once("value").then(snap=>{
      if(key===snap.val()){document.getElementById("adminPanel").style.display="block";entered=true;}
      else alert("Incorrect key");
    });
  }

  const presetSelect=document.getElementById("presetStatus");
  const customStatus=document.getElementById("customStatus");
  const customColor=document.getElementById("customColor");
  const saveBtn=document.getElementById("saveStatus");

  saveBtn.addEventListener("click",()=>{
    let text,color;
    if(presetSelect.value){[text,color]=presetSelect.value.split("|");}
    else if(customStatus.value){text=customStatus.value;color=customColor.value;}
    else{alert("Please select or enter a status");return;}
    db.ref("status").update({text,color});
    alert(`Status updated: ${text}`);
  });
}
