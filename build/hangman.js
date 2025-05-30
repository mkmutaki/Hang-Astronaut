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
const gameoverText = document.querySelector(".gameover-text");
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
      selectedWord: null
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
    document.querySelector(".popup").style.visibility = "visible";
    main.classList.add("blur-over");

    gameoverText.innerText = "Congratulations!";
    gameoverText.style.color = "green";
    document.querySelector(".gameover-content").style.borderColor = "green";

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

  lessenGuesses();

  // Display Gameover box
  if (wrongLetters.length === SkeletonLimbs.length) {
    document.querySelector(".popup").style.visibility = "visible";
    main.classList.add("blur-over");
    nextGame.remove();
    btns.append(playAgain);
    gameoverText.innerText = "GAME OVER";
    gameoverText.style.color = "red";
    document.querySelector(".gameover-content").style.borderColor = "red";

    revealWord.innerText = `The word was: ${selectedWord}`;

    playable = false;
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
  // has been played AND actual gameplay has occurred (guesses made)
  if (categoryProgress[currentCategory].played && 
      (categoryProgress[currentCategory].correctLetters.length > 0 || 
       categoryProgress[currentCategory].wrongLetters.length > 0)) {
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
  categoryProgress[currentCategory].played = true;
}

function resetGame(isNewCategory = false) {
  document.querySelector(".popup").style.visibility = "collapse";
  main.classList.remove("blur-over");
  btnCat.disabled = false;
  btnPlay.disabled = false;

  playable = true;
  
  // Only reset guesses if it's a new category
  if (isNewCategory) {
    resetGuesses();
  }

  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = currentWordList[Math.floor(Math.random() * currentWordList.length)];

  displayWord();

  addWrongLetters();
}

//// Event Listeners ////

window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (playable) {
    // Confirm that key pressed is a letter
    if (alphaKeys.includes(key)) {
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

  closeMenu();
});

// Home button
home.addEventListener("click", function () {
  btnCat.disabled = false;
  btnPlay.disabled = false;
  
  // Save current progress before showing menu
  saveCurrentProgress();
  
  showMenu();
});

// Game over home button
overHome.addEventListener("click", function () {
  // Save current progress before returning to menu
  saveCurrentProgress();
  
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
  new CosmicHangman();
  // Set initial category display to the default category (Planets)
  categoryDisplay.innerText = currentCategory;
  
  // Initialize category progress tracking
  initCategoryProgress();
  
  // Set initial button text
  updatePlayButtonText();
});