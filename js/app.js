/*
 * Create a list that holds all of your cards
 */
const deck = document.getElementsByClassName('deck')[0];
const congratulations = document.getElementsByClassName('congratulations')[0];
const cards = document.getElementsByClassName('card');
const time = document.getElementsByClassName('time')[0];
const timeSummary = document.getElementsByClassName('time-summary')[0];
const moves = document.getElementsByClassName('moves')[0];
const movesSummary = document.getElementsByClassName('moves-summary')[0];
const restart = document.getElementsByClassName('restart')[0];
const stars = document.getElementsByClassName('stars')[0].children;
const summaryStars = document.getElementsByClassName('summary-stars')[0].children;

let timerStarted = false;
let timer = null;
let movesCounter = 0;
let openCard = null;
let seconds = 0;
let matched = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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

function getFormatedTime() {
  let sec = seconds % 60;
  let min = (seconds - sec) / 60;
  return min + ":" + (sec < 10 ? '0' + sec : sec);
}

//timer function
function startTimer() {
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

const resetStarsState = function() {
  Array.from(stars).forEach(function(star) {
    star.classList.remove("hide-star");
  });
}

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

const checkIfWon = function() {
  if (matched !== 1) {
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
  if (movesCounter >= 35) {
    summaryStars[0].classList.add("hide-star");
  }
  timeSummary.textContent = getFormatedTime();
  movesSummary.textContent = movesCounter;
}

const updateMovesCounter = function() {
  movesCounter += 1;
  moves.textContent = movesCounter;
}

const updateStars = function() {
  if (movesCounter === 15) {
    stars[2].classList.add("hide-star");
  } else if (movesCounter === 25) {
    stars[1].classList.add("hide-star");
  } else if (movesCounter === 35) {
    stars[0].classList.add("hide-star");
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

// Zero time, move counts, stars
const setupGameState = function() {
  clearInterval(timer);
  resetStarsState();
  movesCounter = 0;
  timerStarted = false;
  seconds = 0;
  matched = 0;
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

const reset = function() {
  for (const card of cards) {
    resetCardState(card);
  }
  setupGameState();
  shuffleCards();
}

window.addEventListener('load', game);
restart.addEventListener('click', reset);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
