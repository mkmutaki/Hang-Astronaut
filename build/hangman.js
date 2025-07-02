//// Selected elements ////

const dialogBox = document.querySelector(".modal");
const menu = document.querySelector(".modal-content");
const main = document.querySelector(".main-content");

const home = document.querySelector(".home-button");
const playAgain = document.querySelector(".play-again");
const nextGame = document.querySelector(".next-game");
const overHome = document.querySelector(".main-menu");
let btnCat = document.querySelector(".category-button");
let btnPlay = document.querySelector(".start-game");
const btnPlayText = btnPlay.querySelector(".button-text");

const wordEl = document.querySelector(".word-container");
const revealWord = document.querySelector("#reveal-word");
const wrongLettersEl = document.getElementById("wrong_letters");

// New gameover selectors
const gameoverModal = document.querySelector(".gameover-modal");
const gameoverTitle = document.querySelector("#gameover-title");
const gameoverSubtitle = document.querySelector("#gameover-subtitle");
const statusDescription = document.querySelector("#status-description");
const statusIcon = document.querySelector("#status-icon");
const statusGlow = document.querySelector("#status-glow");

const noti = document.querySelector(".notification-container");
const btns = document.querySelector(".buttons-over");

// New selectors for centered categories panel
const categoriesPanel = document.querySelector(".categories-panel");
const closeCategories = document.querySelector(".close-categories");
const categoryItems = document.querySelectorAll(".category-item");

const SkeletonLimbs = document.querySelectorAll(".l");
const guessesLeft = document.querySelector(".guesses-left span");
const categoryDisplay = document.querySelector(".category span");

// Category word lists
const wordCategories = {
  "Planets": ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"],
  "Galaxies": ["milkyway", "andromeda", "triangulum", "whirlpool", "sombrero", "cartwheel", "cigar", "pinwheel", "tadpole"],
  "Space Tech": ["satellite", "telescope", "rover", "spacesuit", "rocket", "probe", "shuttle", "spacestation", "lander"],
  "Astro Gear": ["helmet", "gloves", "boots", "backpack", "radio", "jetpack", "oxygentank", "camera", "tools"],
  "Celestial Phenomena": ["eclipse", "meteor", "comet", "aurora", "supernova", "blackhole", "nebula", "quasar", "pulsar"],
  "Space Missions": ["apollo", "voyager", "hubble", "cassini", "curiosity", "juno", "galileo", "pioneer", "challenger"],
  "🌍 from Space": ["continents", "oceans", "mountains", "deserts", "forests", "coastlines", "rivers", "islands", "clouds"]
};

// Get the default first category
const defaultCategory = Object.keys(wordCategories)[0]; // "Planets"

const alphaKeys = "abcdefghijklmnopqrstuvwxyz".split("");
let score = 0;
let playable = true;
let guesses = 6;
let currentCategory = defaultCategory;
let currentWordList = wordCategories[defaultCategory];
let hasStartedPlaying = false;
let categoryProgress = {}; // Stores progress for each category

const correctLetters = [];
const wrongLetters = [];
let selectedWord = currentWordList[Math.floor(Math.random() * currentWordList.length)];

// Initialize category progress tracking
function initCategoryProgress() {
  Object.keys(wordCategories).forEach(category => {
    categoryProgress[category] = {
      score: 0,
      guesses: 6,
      played: false,
      correctLetters: [],
      wrongLetters: [],
      selectedWord: null,
      completedWords: [] // Track words that have been successfully guessed
    };
  });
}

//// Cosmic Hangman Class ////
class CosmicHangman {
  constructor() {
    this.init();
  }

  init() {
    this.createStars();
    this.startAnimations();
  }

  createStars() {
    const starsContainer = document.querySelector('.animated-stars');
    if (!starsContainer) return;
    
    const starCount = 80;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2 + 0.5;
      const animationDelay = Math.random() * 4;
      const animationDuration = Math.random() * 3 + 3;
      const opacity = Math.random() * 0.6 + 0.3;

      star.style.left = `${left}%`;
      star.style.top = `${top}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${animationDelay}s`;
      star.style.animationDuration = `${animationDuration}s`;
      star.style.opacity = opacity;

      starsContainer.appendChild(star);
    }

    // Create shooting stars
    this.createShootingStars();
  }

  createShootingStars() {
    const starsContainer = document.querySelector('.animated-stars');
    if (!starsContainer) return;
    
    const shootingStarPositions = [
      { top: '25%', left: '0%', delay: 3 },
      { top: '75%', right: '25%', delay: 7 },
      { top: '50%', left: '33%', delay: 10 }
    ];

    shootingStarPositions.forEach((pos, index) => {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      Object.assign(shootingStar.style, {
        top: pos.top,
        left: pos.left || 'auto',
        right: pos.right || 'auto',
        animationDelay: `${pos.delay}s`,
        animationDuration: '6s'
      });

      starsContainer.appendChild(shootingStar);
    });
  }

  startAnimations() {
    // Add any additional animation logic here
    this.animateParticles();
  }

  animateParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
      // Add random movement to particles
      setInterval(() => {
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;
        
        particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(${1 + Math.random() * 0.5})`;
      }, 3000 + index * 1000);
    });
  }

  // Method to create stars for gameover modal
  createGameoverStars() {
    const gameoverStarsContainer = document.querySelector('.gameover-stars');
    if (!gameoverStarsContainer) return;
    
    // Clear existing stars
    gameoverStarsContainer.innerHTML = '';
    
    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2 + 0.5;
      const animationDelay = Math.random() * 4;
      const animationDuration = Math.random() * 4 + 2;
      const opacity = Math.random() * 0.7 + 0.3;

      star.style.left = `${left}%`;
      star.style.top = `${top}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${animationDelay}s`;
      star.style.animationDuration = `${animationDuration}s`;
      star.style.opacity = opacity;

      gameoverStarsContainer.appendChild(star);
    }
  }
}

//// Functions ////

function displayWord() {
  // create "correct letters" span
  wordEl.innerHTML = `${selectedWord
    .split("")
    .map((letter) => `<span class = "letter"> ${correctLetters.includes(letter) ? letter : ""} </span>`)
    .join("")}`;

  const innerWord = wordEl.innerText.replace(/[ \n]/g, "");

  // Check and display if won
  if (innerWord === selectedWord) {
    // Mark this word as completed for the current category
    if (!categoryProgress[currentCategory].completedWords.includes(selectedWord)) {
      categoryProgress[currentCategory].completedWords.push(selectedWord);
    }    document.querySelector(".popup").style.visibility = "visible";
    main.classList.add("blur-over");

    // Ensure animations are enabled when showing the overlay
    document.querySelector(".popup").classList.remove("disable-animations");

    // Create stars for gameover modal
    if (window.cosmicHangman) {
      window.cosmicHangman.createGameoverStars();
    }

    // Apply success state
    gameoverModal.classList.add("success-state");
    gameoverTitle.innerText = "MISSION";
    gameoverSubtitle.innerText = "ACCOMPLISHED";
    statusDescription.innerText = "Outstanding work, space explorer!";
    statusIcon.innerText = "🎉";
    statusGlow.style.background = "rgba(34, 197, 94, 0.3)";

    revealWord.innerText = `Your current score is: ${(score = score + 10)}`;

    playAgain.remove();
    btns.append(nextGame);

    playable = false;
  }
}

function addWrongLetters() {
  // add letters
  wrongLettersEl.innerHTML = `${wrongLetters.map((letter) => `<span>${letter}</span>`).join("")}`;

  // Display limbs on wrong letters
  SkeletonLimbs.forEach((limb, i) => {
    const errors = wrongLetters.length;

    if (i < errors) {
      limb.style.display = "flex";
    } else {
      limb.style.display = "none";
    }
  });

  lessenGuesses();  // Display Gameover box
  if (wrongLetters.length === SkeletonLimbs.length) {
    document.querySelector(".popup").style.visibility = "visible";
    main.classList.add("blur-over");
    
    // Ensure animations are enabled when showing the overlay
    document.querySelector(".popup").classList.remove("disable-animations");
    
    // Create stars for gameover modal
    if (window.cosmicHangman) {
      window.cosmicHangman.createGameoverStars();
    }
    
    nextGame.remove();
    btns.append(playAgain);

    // Apply failure state
    gameoverModal.classList.add("failure-state");
    gameoverTitle.innerText = "MISSION";
    gameoverSubtitle.innerText = "FAILED";
    statusDescription.innerText = "The void has claimed another explorer...";
    statusIcon.innerText = "💀";
    statusGlow.style.background = "rgba(239, 68, 68, 0.3)";

    revealWord.innerText = `The word was: ${selectedWord}`;

    playable = false;
    // Ensure buttons are disabled during game over state
    btnCat.disabled = true;
    btnPlay.disabled = true;
  }
}

function showNotification() {
  noti.classList.add("show");

  setTimeout(() => {
    noti.classList.remove("show");
  }, 3000);
}

function lessenGuesses() {
  if (guesses > 0) guesses--;
  guessesLeft.innerText = `${guesses}/6`;
}

function resetGuesses() {
  guesses = 6;
  guessesLeft.innerText = `${guesses}/6`;
}

function toggleCat() {
  // Show the centered categories panel instead of the dropdown
  categoriesPanel.classList.toggle("hidden");
  
  // Add a subtle animation effect when showing
  if (!categoriesPanel.classList.contains("hidden")) {
    const container = categoriesPanel.querySelector('.categories-container');
    container.style.opacity = "0";
    container.style.transform = "scale(0.95)";
    
    setTimeout(() => {
      container.style.opacity = "1";
      container.style.transform = "scale(1)";
    }, 10);
  }
}

function setCategory(category) {
  // Check if selecting a new category
  const isNewCategory = category !== currentCategory;
  
  // Make sure the category exists in our wordCategories
  if (wordCategories[category]) {
    // If it's a new category, reset game state
    if (isNewCategory) {
      // Save current category progress before switching
      saveCurrentProgress();
      
      // Set new category
      currentCategory = category;
      categoryDisplay.innerText = category;
      currentWordList = wordCategories[category];
      
      // Reset game state for new category
      if (!categoryProgress[category].played) {
        // New category that hasn't been played
        resetGame(true);
        score = 0;
      } else {
        // Restore previous progress for this category
        restoreCategoryProgress(category);
      }
      
      // Update begin/continue button text
      updatePlayButtonText();
    }
  }
}

function saveCurrentProgress() {
  // Save current progress for the current category
  categoryProgress[currentCategory] = {
    score: score,
    guesses: guesses,
    played: true,
    correctLetters: [...correctLetters],
    wrongLetters: [...wrongLetters],
    selectedWord: selectedWord
  };
}

function restoreCategoryProgress(category) {
  // Restore progress for the specified category
  const progress = categoryProgress[category];
  
  // Restore game state
  score = progress.score;
  guesses = progress.guesses;
  guessesLeft.innerText = `${guesses}/6`;
  
  // Clear current letters
  correctLetters.splice(0);
  wrongLetters.splice(0);
  
  // Restore letters
  progress.correctLetters.forEach(letter => correctLetters.push(letter));
  progress.wrongLetters.forEach(letter => wrongLetters.push(letter));
  
  // Restore word or select a new one
  if (progress.selectedWord && wordCategories[category].includes(progress.selectedWord)) {
    selectedWord = progress.selectedWord;
  } else {
    selectedWord = currentWordList[Math.floor(Math.random() * currentWordList.length)];
    progress.selectedWord = selectedWord;
  }
  
  // Update display
  displayWord();
  addWrongLetters();
}

function updatePlayButtonText() {
  // Change button text to "CONTINUE MISSION" only if the current category 
  // has been played AND actual gameplay has occurred (guesses made) AND the game is not over
  const categoryData = categoryProgress[currentCategory];
  const hasGameplayData = categoryData.correctLetters.length > 0 || categoryData.wrongLetters.length > 0;
  
  if (categoryData.played && hasGameplayData && playable) {
    btnPlayText.textContent = "CONTINUE MISSION";
  } else {
    btnPlayText.textContent = "BEGIN MISSION";
  }
}

function showMenu() {
  dialogBox.style.visibility = "visible";
  dialogBox.style.opacity = 1;
  main.classList.toggle("blur-out");
  main.classList.toggle("blur-in");
  
  // Hide gameover popup if it's visible with instant animations disabled
  const popupOverlay = document.querySelector(".popup");
  if (popupOverlay.style.visibility === "visible") {
    popupOverlay.classList.add("disable-animations");
    popupOverlay.style.visibility = "collapse";
    main.classList.remove("blur-over");
    
    // Clear gameover state classes
    gameoverModal.classList.remove("success-state", "failure-state");
    
    // Re-enable animations after closing
    setTimeout(() => {
      popupOverlay.classList.remove("disable-animations");
    }, 50);
  }
  
  // Re-enable buttons that might have been disabled during gameplay
  btnCat.disabled = false;
  btnPlay.disabled = false;
  
  // Ensure menu is properly interactable
  menu.classList.remove("disable-animations");
  
  // Update begin/continue button text
  updatePlayButtonText();
}

function closeMenu() {
  dialogBox.style.opacity = 0;
  main.classList.toggle("blur-in");
  main.classList.toggle("blur-out");
  setTimeout(() => {
    dialogBox.style.visibility = "collapse";
  }, 300);
  
  // Mark that gameplay has started
  hasStartedPlaying = true;
  
  // Only mark the category as played if the user has made progress in it
  // (will be updated properly once they make a guess)
  if (correctLetters.length > 0 || wrongLetters.length > 0) {
    categoryProgress[currentCategory].played = true;
  }
}

function resetGame(isNewCategory = false) {
  const popupOverlay = document.querySelector(".popup");
  
  // Instantly disable animations when closing
  popupOverlay.classList.add("disable-animations");
  
  // Hide the overlay immediately
  popupOverlay.style.visibility = "collapse";
  main.classList.remove("blur-over");
  btnCat.disabled = false;
  btnPlay.disabled = false;

  // Clear gameover state classes
  gameoverModal.classList.remove("success-state", "failure-state");

  // Restore playable state
  playable = true;
  
  // Only reset guesses if it's a new category
  if (isNewCategory) {
    resetGuesses();
  }

  // Clear letter arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  // Select a new word
  selectNewWord();

  // Update display
  displayWord();
  wrongLettersEl.innerHTML = "";
  
  // Reset visual hangman state
  SkeletonLimbs.forEach(limb => {
    limb.style.display = "none";
  });

  // Remove the disable-animations class after a brief moment to re-enable animations for future use
  setTimeout(() => {
    popupOverlay.classList.remove("disable-animations");
  }, 50);
}

function selectNewWord() {
  const availableWords = currentWordList.filter(word => 
    !categoryProgress[currentCategory].completedWords.includes(word)
  );
  
  if (availableWords.length === 0) {
    // All words in this category have been completed
    // Could show a completion message or reset the category
    categoryProgress[currentCategory].completedWords = [];
    selectedWord = currentWordList[Math.floor(Math.random() * currentWordList.length)];
  } else {
    selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
  }
}

//// Event Listeners ////

window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (playable) {
    // Confirm that key pressed is a letter
    if (alphaKeys.includes(key)) {
      // Mark the category as played when the first guess is made
      categoryProgress[currentCategory].played = true;
      
      if (selectedWord.includes(key)) {
        if (!correctLetters.includes(key)) {
          correctLetters.push(key);
          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(key)) {
          wrongLetters.push(key);

          addWrongLetters();
        } else {
          showNotification();
        }
      }
    }
  }
});

displayWord();

// Category button functionality
btnCat.addEventListener("click", function () {
  toggleCat();
});

btnCat.addEventListener("focusout", function () {
  let categoryList = document.querySelector(".category-list .list");
  if (categoryList) {
    setTimeout(() => {
      categoryList.classList.add("hidden");
    }, 200);
  }
});

// Category selection functionality
categoryItems.forEach(item => {
  item.addEventListener("click", function() {
    setCategory(this.textContent);
    toggleCat();
  });
});

// Close categories panel
closeCategories.addEventListener("click", function() {
  categoriesPanel.classList.add("hidden");
});

// Start game button
btnPlay.addEventListener("click", function () {
  btnCat.disabled = true;
  btnPlay.disabled = true;

  // If starting a fresh mission (BEGIN MISSION), ensure everything is properly reset
  if (btnPlayText.textContent === "BEGIN MISSION") {
    // Reset visual display completely
    wrongLettersEl.innerHTML = "";
    SkeletonLimbs.forEach(limb => {
      limb.style.display = "none";
    });
    
    // Do not mark as played yet - only mark when user makes first guess
    categoryProgress[currentCategory].played = false;
    
    // If there's no ongoing game data, select a new word
    if (categoryProgress[currentCategory].correctLetters.length === 0 && 
        categoryProgress[currentCategory].wrongLetters.length === 0) {
      selectNewWord();
      displayWord();
    }
  }

  closeMenu();
});

// Home button
home.addEventListener("click", function () {
  // Check if a game is in progress (playable and some letters have been entered)
  const hasGameProgress = correctLetters.length > 0 || wrongLetters.length > 0;
  
  if (playable && hasGameProgress) {
    // Only save progress if the game is actually in progress with some user input
    saveCurrentProgress();
  } else if (!playable) {
    // If game was over (won or lost), reset the current category progress
    categoryProgress[currentCategory] = {
      score: 0,
      guesses: 6,
      played: false,
      correctLetters: [],
      wrongLetters: [],
      selectedWord: null,
      completedWords: categoryProgress[currentCategory].completedWords || []
    };
    
    // Reset game state
    score = 0;
    resetGuesses();
    correctLetters.splice(0);
    wrongLetters.splice(0);
    playable = true;
    
    // Clear visual elements
    wrongLettersEl.innerHTML = "";
    SkeletonLimbs.forEach(limb => {
      limb.style.display = "none";
    });
    
    // Select new word and update display
    selectNewWord();
    displayWord();
  } else {
    // If game was just started but no letters guessed yet,
    // reset the 'played' flag for the current category
    categoryProgress[currentCategory].played = false;
  }
  
  // Re-enable buttons
  btnCat.disabled = false;
  btnPlay.disabled = false;
  
  // Show the menu with all functionality restored
  showMenu();
});

// Game over home button
overHome.addEventListener("click", function () {
  // When coming from a game over state, reset the category completely
  categoryProgress[currentCategory] = {
    score: 0,
    guesses: 6,
    played: false,  // This is crucial - set to false to reset the category state
    correctLetters: [],
    wrongLetters: [],
    selectedWord: null,
    completedWords: categoryProgress[currentCategory].completedWords || []
  };
  
  // Reset game state
  score = 0;
  resetGuesses();
  correctLetters.splice(0);
  wrongLetters.splice(0);
  playable = true;
  
  // Clear visual elements
  wrongLettersEl.innerHTML = "";
  SkeletonLimbs.forEach(limb => {
    limb.style.display = "none";
  });
  
  // Select new word and update display
  selectNewWord();
  displayWord();
  
  // Reset buttons in menu
  btnCat.disabled = false;
  btnPlay.disabled = false;
  
  // Ensure all animations are reset
  const popupOverlay = document.querySelector(".popup");
  popupOverlay.classList.add("disable-animations");
  
  // Show menu with all functionality restored
  showMenu();
});

// Play again button
playAgain.addEventListener("click", function () {
  // Reset score for current category
  score = 0;
  categoryProgress[currentCategory].score = 0;
  
  resetGame(true);
});

// Next game button
nextGame.addEventListener("click", function () {
  resetGame();
});

// Mouse movement effects for particles
document.addEventListener('mousemove', (e) => {
  const particles = document.querySelectorAll('.particle');
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  particles.forEach((particle, index) => {
    const offsetX = (mouseX - 0.5) * (10 + index * 5);
    const offsetY = (mouseY - 0.5) * (10 + index * 5);
    
    particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
});

// Initialize cosmic effects
document.addEventListener('DOMContentLoaded', () => {
  window.cosmicHangman = new CosmicHangman();
  // Set initial category display to the default category (Planets)
  categoryDisplay.innerText = currentCategory;
  
  // Initialize category progress tracking
  initCategoryProgress();
  
  // Set initial button text
  updatePlayButtonText();
});