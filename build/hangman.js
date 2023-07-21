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

const wordEl = document.querySelector(".word-container");
const revealWord = document.querySelector("#reveal-word");
const wrongLettersEl = document.getElementById("wrong_letters");
const gameoverText = document.querySelector(".gameover-text");
const noti = document.querySelector(".notification-container");
const btns = document.querySelector(".buttons-over");

const SkeletonLimbs = document.querySelectorAll(".l");
const guessesLeft = document.querySelector(".guesses-left span");

const words = ["secondary", "blueface", "programmer", "artificial", "bread"];
const alphaKeys = "abcdefghijklmnopqrstuvwxyz".split("");
let score = 0;
let playable = true;
let guesses = 6;
let category = "food";
let queryParam = category;

const correctLetters = [];
const wrongLetters = [];
let selectedWord = words[Math.floor(Math.random() * words.length)];

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
  guesses = 7;
  guessesLeft.innerText = `${guesses}/6`;
}

function toggleCat() {
  let category = document.querySelector(".category-list .list");
  category.classList.toggle("hidden");
}

function showMenu() {
  dialogBox.style.visibility = "visible";
  dialogBox.style.opacity = 1;
  main.classList.toggle("blur-out");
  main.classList.toggle("blur-in");
}

function closeMenu() {
  dialogBox.style.opacity = 0;
  main.classList.toggle("blur-in");
  main.classList.toggle("blur-out");
  setTimeout(() => {
    dialogBox.style.visibility = "collapse";
  }, 300);
}

function resetGame() {
  document.querySelector(".popup").style.visibility = "collapse";
  main.classList.remove("blur-over");
  btnCat.disabled = false;
  btnPlay.disabled = false;
  score = 0;

  playable = true;
  resetGuesses();

  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

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

// btnCat.addEventListener("click", function () {
//   toggleCat();
// });

// btnCat.addEventListener("focusout", function () {
//   let category = document.querySelector(".category-list .list");
//   category.classList.add("hidden");
// });

btnPlay.addEventListener("click", function () {
  btnCat.disabled = true;
  btnPlay.disabled = true;

  closeMenu();
});

home.addEventListener("click", function () {
  btnCat.disabled = false;
  btnPlay.disabled = false;
  score = 0;

  showMenu();
});

overHome.addEventListener("click", function () {
  resetGame();
  showMenu();
  score = 0;
});

playAgain.addEventListener("click", function () {
  resetGame();
});

nextGame.addEventListener("click", function () {
  resetGame();
});

//// Categories ////
