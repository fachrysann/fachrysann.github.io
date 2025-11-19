// Detect page reload vs normal navigation
if (performance.getEntriesByType("navigation")[0].type === "reload") {
    localStorage.removeItem("chatHistory");   // Reset only on reload
}

const pixelCursor = document.querySelector(".pixel-cursor");
const grid = 12;

document.addEventListener("mousemove", (e) => {
  const x = Math.round(e.clientX / grid) * grid;
  const y = Math.round(e.clientY / grid) * grid;

  pixelCursor.style.left = x + "px";
  pixelCursor.style.top = y + "px";
});

document.addEventListener("mousemove", (e) => {
  const x = Math.round(e.clientX / grid) * grid;
  const y = Math.round(e.clientY / grid) * grid;

  pixelCursor.style.left = x + "px";
  pixelCursor.style.top = y + "px";

  const trail = document.createElement("div");
  trail.classList.add("pixel-trail");
  trail.style.left = x + "px";
  trail.style.top = y + "px";
  document.body.appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 5000);
});


/* -------------------------------
   TILE GRID (5x5) + HOVER TRACES
--------------------------------*/
const tilesContainer = document.querySelector(".tiles");
const gridCount = 7 * 7;

// generate tiles
for (let i = 0; i < gridCount; i++) {
  const tile = document.createElement("div");
  tilesContainer.appendChild(tile);

  // fade trace on hover
  tile.addEventListener("mouseenter", () => {
    tile.classList.remove("active");
    void tile.offsetWidth; 
    tile.classList.add("active");
  });
}


/* -------------------------------
   AUTO RIPPLE WAVE EFFECT
--------------------------------*/

// STEP 1: assign coordinates (x, y) to all tiles
const tiles = document.querySelectorAll(".tiles div");
const size = 7; // 5x5 grid

tiles.forEach((tile, i) => {
  tile.dataset.x = i % size;
  tile.dataset.y = Math.floor(i / size);
});

function startAutoRipple() {
  const tiles = document.querySelectorAll(".tiles div");

  // how many tiles should blur per cycle
  const count = Math.floor(Math.random() * 20) + 10;  
  // between 4 and 24 tiles at once

  for (let i = 0; i < count; i++) {

    const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
    randomTile.classList.add("wave-1");

    // independent fade-out timing (random per tile)
    const fadeTime = Math.random() * 7000 + 1500;
    // between 1.5s and 5.5s

    setTimeout(() => {
      randomTile.classList.remove("wave-1");
    }, fadeTime);
  }
}
setInterval(startAutoRipple, 5000);

const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatMessages = document.querySelector(".chatbox-messages");
const chatToggle = document.querySelector(".chat-toggle");
const chatbox = document.querySelector(".chatbox");
const badge = document.querySelector(".chat-badge");

function addBubble(text, sender = "user", save = true) {
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble", sender);
  bubble.textContent = text;
  chatMessages.appendChild(bubble);

  // Auto-scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Save to history
  if (save) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ text, sender });
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }

  // Show badge if bot msg & minimized
  if (sender === "bot" && !chatbox.classList.contains("active")) {
    badge.style.display = "block";
  }
}

function loadChatHistory() {
  const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");

  history.forEach(msg => {
    addBubble(msg.text, msg.sender, false); // false = don't re-save
  });

  // Scroll to bottom after loading
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

window.addEventListener("load", () => {
  loadChatHistory();

  const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");

  // Show welcome ONLY if no previous chat
  if (history.length === 0) {
    setTimeout(() => {
      addBubble("👋 Welcome to my page!", "bot");
      addBubble("Feel free to ask anything or explore around 🙂", "bot");
    }, 500);
  }
});

// Send on button click
chatSend.onclick = () => {
  if (!chatInput.value.trim()) return;
  addBubble(chatInput.value, "user");
  chatInput.value = "";

  // Fake bot response
  setTimeout(() => {
    addBubble("Thanks! How can I help?", "bot");
  }, 800);
};

// Send on Enter
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") chatSend.click();
});

chatToggle.addEventListener("click", () => {
  chatbox.classList.toggle("active");

  if (chatbox.classList.contains("active")) {
    badge.style.display = "none"; // reset unread badge
  }
});

const fadeTop = document.querySelector(".chat-fade-top");

chatMessages.addEventListener("scroll", () => {
  if (chatMessages.scrollTop > 5) {
    fadeTop.style.opacity = "1";
  } else {
    fadeTop.style.opacity = "0";
  }
});



