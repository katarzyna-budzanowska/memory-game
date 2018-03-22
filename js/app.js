/*
 * Create a list that holds all of your cards
 */
const deck    = document.getElementsByClassName('deck')[0];
const cards   = document.getElementsByClassName('card');
const time    = document.getElementsByClassName('time')[0];
const moves   = document.getElementsByClassName('moves')[0];
const restart = document.getElementsByClassName('restart')[0];

let timerStarted = false;
let timer = null;
let movesCounter = 0;
let openCard = null;
let seconds = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//timer function
function startTimer() {
    timerStarted = true;
    timer = setInterval( function() {
        seconds++;
        let sec = seconds % 60;
        let min = (seconds - sec) / 60;
        time.textContent = min + ":" + ( sec < 10 ? '0' + sec : sec );
    }, 1000);
}

// Clear card state
const resetCardState = function ( card ) {
  card.classList.remove("show", "open", "match", "avoid-clicks");
}

const markAsMatched = function( card ) {
  card.classList.add('match');
}

// Card click event handler
const cardClick = function( event ) {
  if( ! timerStarted ) {
    startTimer();
  }

  const target = event.target;
  target.classList.add("open", "show", "avoid-clicks");
  if( openCard ) {
    updateMovesCounter();
    deck.classList.add( "avoid-clicks" );
    setTimeout( function() {
      if( openCard.isEqualNode( target ) ) {
        markAsMatched( target );
        markAsMatched( openCard );
      } else {
        resetCardState( target );
        resetCardState( openCard );
      }
      openCard = null;
      deck.classList.remove( "avoid-clicks" );
    }, 1000 );
  } else {
    openCard = target;
  }
}

const updateMovesCounter = function() {
  movesCounter += 1;
  moves.textContent = movesCounter;
}

// Cards setup, state reset, events
const setupCards = function() {
    for (const card of cards) {
        resetCardState( card );
        card.addEventListener('click', cardClick);
    }
};

// Zero time, move counts, stars
const setupGameState = function() {
  clearInterval( timer );
  movesCounter = 0;
  timerStarted = false;
  seconds = 0;
  moves.textContent = 0;
  time.textContent = "00:00";
}

// Main game function
const game = function () {
  setupGameState();
  setupCards();
}

window.addEventListener('load', game);
restart.addEventListener('click', game);

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
