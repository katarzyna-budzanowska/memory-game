// Handlers to UI elements
const deck = document.getElementsByClassName('deck')[0];
const congratulations = document.getElementsByClassName('congratulations')[0];
const cards = document.getElementsByClassName('card');
const time = document.getElementsByClassName('time')[0];
const timeSummary = document.getElementsByClassName('time-summary')[0];
const moves = document.getElementsByClassName('moves')[0];
const movesSummary = document.getElementsByClassName('moves-summary')[0];
const restart = document.getElementsByClassName('restart');
const stars = document.getElementsByClassName('stars')[0].children;
const summaryStars = document.getElementsByClassName('summary-stars')[0].children;

// Game state
let timerStarted = false;
let timer = null;
let movesCounter = 0;
let openCard = null;
let seconds = 0;
let matched = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = function(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Create formated time string out of seconds counter
const getFormatedTime = function() {
  let sec = seconds % 60;
  let min = (seconds - sec) / 60;
  return min + ":" + (sec < 10 ? '0' + sec : sec);
}

//timer function
const startTimer = function() {
  timerStarted = true;
  timer = setInterval(function() {
    seconds++;
    time.textContent = getFormatedTime();
  }, 1000);
}

// Clear card state
const resetCardState = function(card) {
  card.classList.remove("show", "open", "match", "avoid-clicks");
}

// Reset stars state, 3 stars should be visible
const resetStarsState = function() {
  Array.from(stars).forEach(function(star) {
    star.classList.remove("hide-star");
  });
}

// Mark single card as matched
const markAsMatched = function(card) {
  card.classList.add('match');
}

// Card click event handler
const cardClick = function(event) {
  if (!timerStarted) {
    startTimer();
  }

  const target = event.target;
  target.classList.add("open", "show", "avoid-clicks");
  if (openCard) {
    updateMovesCounter();
    updateStars();
    deck.classList.add("avoid-clicks");
    setTimeout(function() {
      if (openCard.isEqualNode(target)) {
        markAsMatched(target);
        markAsMatched(openCard);
        matched += 1;
        checkIfWon();
      } else {
        resetCardState(target);
        resetCardState(openCard);
      }
      openCard = null;
      deck.classList.remove("avoid-clicks");
    }, 1000);
  } else {
    openCard = target;
  }
}

// Check if all cards are matched and prepare congratulations if so.
const checkIfWon = function() {
  if (matched !== 8) {
    return;
  }
  clearInterval(timer);
  deck.classList.add("hidden");
  congratulations.classList.remove("hidden");
  if (movesCounter >= 15) {
    summaryStars[2].classList.add("hide-star");
  }
  if (movesCounter >= 25) {
    summaryStars[1].classList.add("hide-star");
  }
  timeSummary.textContent = getFormatedTime();
  movesSummary.textContent = movesCounter;
}

// Update moves counter and display new value
const updateMovesCounter = function() {
  movesCounter += 1;
  moves.textContent = movesCounter;
}

// Update stars number in scorecard
const updateStars = function() {
  if (movesCounter === 15) {
    stars[2].classList.add("hide-star");
  } else if (movesCounter === 25) {
    stars[1].classList.add("hide-star");
  }
}

// Cards setup, state reset, events
const setupCards = function() {
  for (const card of cards) {
    resetCardState(card);
    card.addEventListener('click', cardClick);
  }
};

const shuffleCards = function() {
  const shuffledCards = shuffle(Array.from(cards));
  shuffledCards.forEach(function(card) {
    deck.appendChild(card);
  })
}

// Zero time, move counts or stars
const setupGameState = function() {
  clearInterval(timer);
  resetStarsState();
  movesCounter = 0;
  timerStarted = false;
  seconds = 0;
  matched = 0;
  openCard = null;
  moves.textContent = 0;
  time.textContent = "00:00";
  deck.classList.remove("hidden");
  congratulations.classList.add("hidden");
}

// Main game function
const game = function() {
  reset();
  setupCards();
}

// Put game in the initial state
const reset = function() {
  for (const card of cards) {
    resetCardState(card);
  }
  setupGameState();
  shuffleCards();
}

// Initial setup
window.addEventListener('load', game);
restart[0].addEventListener('click', reset);
restart[1].addEventListener('click', reset);
