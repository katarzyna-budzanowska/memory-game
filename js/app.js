/*
 * Create a list that holds all of your cards
 */
const deck  = document.getElementsByClassName('deck')[0];
const cards = Array.from( document.getElementsByClassName('card') );
const timer = document.getElementsByClassName('time');

let openCard = null;

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
function gameTimer() {
    time = setInterval(function() {

        sec++;
        if (sec < 10) {
            sec = "0" + sec;
        }
        timer[0].innerHTML = min + ":" + sec;
        timer[1].innerHTML = min + ":" + sec;

        if (sec === 60) {
            min++;
            sec = 0;
        }
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
  const target = event.target;
  console.log( event.target );
  console.log('card clicked!');
  target.classList.add("open", "show", "avoid-clicks");
  if( openCard ) {
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

// Cards setup, state reset, events
const setupCards = function() {
    for (const card of cards) {
        resetCardState( card );
        card.addEventListener("click", cardClick);
    }
};

// Main game function
const game = function () {
  setupCards();
}

window.addEventListener('load', game);

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
