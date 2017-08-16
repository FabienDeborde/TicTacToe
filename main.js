$(document).ready(function() {

  var popupEl = $('.pop-up-window');
  var popupMsgEl = $('.msg-txt');
  var btnRightEl = $('.btn-right-txt');
  var btnLeftEl = $('.btn-left-txt');
  var btnEl = $('.btn-txt');
  var board = $('main.grid-container');
  var space = $('.col');

  var game = {
    // Store the state of the game
    debug: true,

    // Store the symbols of each side
    player: '',
    computer: '',

    togglePopup: function() {
      popupEl.toggleClass('hidden');
    },

    updatePopup: function(msg, left, right) {
      popupMsgEl.text(msg);
      btnLeftEl.text(left);
      btnRightEl.text(right);
    },

    tiePopup: function() {
      popupEl.attr('id', 'tie');
      game.updatePopup('It\'s a tie!', 'Stop', 'Play again');
    },
    winningPopup: function() {
      popupEl.attr('id', 'win');
      game.updatePopup('You won!', 'Stop', 'Play again');
    },
    gameOverPopup: function() {
      popupEl.attr('id', 'gameover');
      game.updatePopup('Game over', 'Stop', 'Retry');
    }
  }


  game.togglePopup();


  btnEl.on('click', function(){
    var choice = '';
    choice = $(this)[0].textContent;
    game.togglePopup();

    if (popupEl.attr('id') === 'side') {
      game.player = choice;
      if (choice === 'O') {
        game.computer = 'X';
      } else {
        game.computer = 'O';
      }
    } else {

    }

    console.log(choice);
  })


if (game.debug) {
  btnEl.addClass('debug');
  space.addClass('debug');
  $('.debug').on('click', function(){
    console.log(game);
  })
  console.log(game);
}


})
