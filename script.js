const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {

        // Get the target section's ID from the data-target attribute
        const targetId = button.getAttribute('data-target');

        // Remove the 'active' class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add the 'active' class to the clicked button
        button.classList.add('active');

        // Hide all tab content sections
        tabContents.forEach(content => content.classList.remove('active'));

        // Show the tab content that matches the clicked button's target
        const activeSection = document.getElementById(targetId);
        activeSection.classList.add('active');

        // Remove the animate-in class from all project cards in the active section (reset for reanimation)
        const projectCards = activeSection.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.classList.remove('animate-in');
            // Force reflow to reset the animation (optional but can help when switching quickly)
            void card.offsetWidth;
            // Add the animate-in class to trigger the animation
            card.classList.add('animate-in');
        });
    });
});

// ---------------------------------------------------------
// Lightbox Functionality 
// ---------------------------------------------------------
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');

lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior
        const fullImgSrc = this.getAttribute('href'); // Get the full-size image URL
        lightboxImage.src = fullImgSrc; // Set the lightbox image source
        lightboxOverlay.style.display = 'flex'; // Show the overlay
    });
});

lightboxOverlay.addEventListener('click', function() {
    lightboxOverlay.style.display = 'none';
});


// Animate on load!!!

document.addEventListener('DOMContentLoaded', () => {
    // Identify the active tab-content on load (default is Game Dev)
    const activeSection = document.querySelector('.tab-content.active');
    if (activeSection) {
        // Select all project cards within the active section
        const projectCards = activeSection.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            // Remove the class first to reset (in case of caching)
            card.classList.remove('animate-in');
            // Force a browser reflow to reset the animation state
            void card.offsetWidth;
            // Add the class to trigger the slide-in animation
            card.classList.add('animate-in');
        });
    }
});

// ---------------------------------------------------------
// Tic Tac Toe Game Functionality (robust AI + thinking UI)
// ---------------------------------------------------------

const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let options = Array(9).fill("");
let currentPlayer = "X";     // 'X' = human, 'O' = AI
let running = false;
let aiEnabled = true;

// Controls whether player input is accepted (false while AI thinking)
let isAITurn = false;

// Thinking animation interval
let thinkInterval = null;
let thinkDots = 0;

initializeGame();

function initializeGame() {
  // ensure cells have indices and are cleared
  cells.forEach((cell, idx) => {
    cell.setAttribute("cellIndex", idx);
    cell.textContent = "";
    cell.addEventListener("click", cellClicked);
  });

  restartBtn.addEventListener("click", restartGame);

  currentPlayer = "X";
  isAITurn = false;
  running = true;
  options = Array(9).fill("");
  statusText.textContent = "Your Turn.";
}

// Human click handler
function cellClicked() {
  if (!running) return;
  if (isAITurn) return; // ignore clicks while AI is thinking

  const idx = Number(this.getAttribute("cellIndex"));
  if (options[idx] !== "") return;

  // Human is always X when clicking
  currentPlayer = "X";
  updateCell(this, idx);

  const result = checkWinner(); // 'X' || 'O' || 'draw' || null
  if (result) {
    handleEnd(result);
    return;
  }

  // If AI is enabled, start AI turn
  if (aiEnabled) {
    startAITurn();
  } else {
    // If no AI, just flip player (for two-player mode)
    currentPlayer = "O";
    statusText.textContent = "My Turn.";
  }
}

function updateCell(cell, index){
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function checkWinner(){
  // return 'X' or 'O' if someone won, 'draw' if full, otherwise null
  for (let [a,b,c] of winConditions){
    if (options[a] && options[a] === options[b] && options[b] === options[c]) {
      return options[a];
    }
  }
  if (!options.includes("")) return "draw";
  return null;
}

function handleEnd(result){
  running = false;
  stopThinking();

  if (result === "draw") {
    statusText.textContent = `It's a draw...`;
    return;
  }

  if (result === "O" && aiEnabled) {
    statusText.textContent = `I won! My contact info is at the bottom, to schedule an interview. :)`;
  } else if (result === "X") {
    statusText.textContent = `You won! ...You should still interview me though!!`;
  } else {
    // fallback
    statusText.textContent = `${result} wins!`;
  }
}

// ---------------- AI flow & thinking UI ----------------

function startAITurn(){
  if (!running) return;

  isAITurn = true;
  currentPlayer = "O";
  startThinking();  // starts the "My Turn." animation
  // Wait 300ms (think) then perform AI move
  setTimeout(() => {
    if (!running) return; // maybe game ended in the meantime
    aiMakeMove();
  }, 300);
}

function aiMakeMove(){
  // AI selects move
  const move = findBestMove();
  // fallback if nothing returned
  const chosen = (move === null || move === undefined) ? options.findIndex(v => v === "") : move;
  if (chosen === -1 || chosen === null || chosen === undefined) {
    // nothing left -> declare draw
    handleEnd("draw");
    return;
  }

  // apply AI move
  const cell = cells[chosen];
  updateCell(cell, chosen);

  // check result
  const result = checkWinner();
  if (result) {
    handleEnd(result);
    return;
  }

  // AI finished; flip back to player
  stopThinking();
  isAITurn = false;
  currentPlayer = "X";
  statusText.textContent = "Your Turn.";
}

function startThinking() {
  stopThinking(); // clear any previous interval
  thinkDots = 0;
  statusText.textContent = "My Turn.";
  // update every 100ms as requested
  thinkInterval = setInterval(() => {
    thinkDots = (thinkDots + 1) % 4; // 0..3
    statusText.textContent = "My Turn" + ".".repeat(thinkDots);
  }, 100);
}

function stopThinking() {
  if (thinkInterval !== null) {
    clearInterval(thinkInterval);
    thinkInterval = null;
  }
  thinkDots = 0;
}

// ---------------- Smart AI (same priority rules) ----------------

function aiCanWinOrBlock(player){
  for (let [a,b,c] of winConditions){
    const line = [options[a], options[b], options[c]];
    const emptyCount = line.filter(v => v === "").length;
    const playerCount = line.filter(v => v === player).length;
    if (playerCount === 2 && emptyCount === 1) {
      if (options[a] === "") return a;
      if (options[b] === "") return b;
      if (options[c] === "") return c;
    }
  }
  return null;
}

function findBestMove(){
  // 1) Win if possible
  let win = aiCanWinOrBlock("O");
  if (win !== null) return win;

  // 2) Block player's win
  let block = aiCanWinOrBlock("X");
  if (block !== null) return block;

  // 3) Center
  if (options[4] === "") return 4;

  // 4) Corner
  const corners = [0,2,6,8];
  for (let c of corners) if (options[c] === "") return c;

  // 5) Any open space
  const anyOpen = options.findIndex(v => v === "");
  return anyOpen === -1 ? null : anyOpen;
}

// ---------------- Restart logic (50/50 starter) ----------------

function restartGame() {
  // clear board first
  options = Array(9).fill("");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.background = "";
  });

  running = true;
  isAITurn = false;
  stopThinking();

  // 50/50 chance who starts
  if (Math.random() < 0.5) {
    // human starts
    currentPlayer = "X";
    statusText.textContent = "Your Turn.";
  } else {
    // AI starts
    currentPlayer = "O";
    // show thinking UI and let AI move after a short delay
    isAITurn = true;
    startThinking();
    setTimeout(() => {
      if (!running) return;
      aiMakeMove();
      // aiMakeMove will stop thinking and flip to player if needed
    }, 300);
  }
}
