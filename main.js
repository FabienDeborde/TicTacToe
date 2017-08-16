$(document).ready(function() {

  var popupEl = $('.pop-up-window');
  var popupMsgEl = $('.msg-txt');
  var btnRightEl = $('.btn-right-txt');
  var btnLeftEl = $('.btn-left-txt');
  var btnEl = $('.btn-txt');
  var board = $('main.grid-container');
  var blocks = $('.col');

  var game = {
    // Store the state of the game
    debug: true,
    clickable: true,
    playerTurn: Boolean,

    // Store the symbols of each side
    player: '',
    computer: '',

    // Store the used blocks
    playerBlocks: [[], [], []],
    computerBlocks: [[], [], []],

    // Update the block text
    updateBlock: function(el, side) {
      el.text(side);
      el.addClass('used');
    },

    // Computer turn
    computerTurn: function() {
      console.log('computer turn');

      // Update playerTurn
      game.playerTurn = true;
    },

    // Check if the game is done
    checkWin: function(side, val) {
      console.log(val);
      var count = 0;
      game[side].map(function(row){ // Map through the used blocks array
        if (row.length === 3) { // if there is a line
          game.winningPopup(); // you win
        } else if (row.indexOf(val) !== -1) { // if there is element in the same column
          count += 1 // add 1 to the counter
        }
      });
      if (count === 3) { // if there is a full column
        game.winningPopup(); // you win
      };
      if (game[side][0].indexOf('a') !== -1 && game[side][1].indexOf('b') !== -1 && game[side][2].indexOf('c') !== -1 ) {
        game.winningPopup(); // you win
      }
      if (game[side][0].indexOf('c') !== -1 && game[side][1].indexOf('b') !== -1 && game[side][2].indexOf('a') !== -1 ) {
        game.winningPopup(); // you win
      }

    },

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
      console.log('win');
      game.togglePopup();
      popupEl.attr('id', 'win');
      game.updatePopup('You won!', 'Stop', 'Play again');
    },
    gameOverPopup: function() {
      popupEl.attr('id', 'gameover');
      game.updatePopup('Game over', 'Stop', 'Retry');
    },
    reset: function() {
      // Reset the popup window
      popupEl.attr('id', 'side');
      game.updatePopup('Choose your side', 'X', 'O');
      game.togglePopup();
      // Clear the board
      blocks.text('');
      blocks.removeClass('used');
      // Reset the stored data
      game.playerTurn = Boolean;
      game.player = '';
      game.computer = '';
      game.playerBlocks = [[], [], []];
      game.computerBlocks = [[], [], []];
    },
    stop: function() {
      game.clickable = false;
    }
  }

  // Popup buttons click handler
  btnEl.on('click', function(){
    // Store the player choice and close the popup
    var choice = '';
    choice = $(this)[0].textContent;
    game.togglePopup();

    if (popupEl.attr('id') === 'side') { // If it's the side choosing popup,
      game.player = choice; // store the player choice in the game object
      if (choice === 'O') { // and give opposite side to the computer
        // computer should start
        game.playerTurn = false;
        game.computer = 'X';
        game.computerTurn();
      } else {
        // player should start
        game.playerTurn = true;
        game.computer = 'O';
      }
    } else { // If it's another popup
      if (choice === 'Stop') { // If the player choose to stop
        game.stop(); // stop the game
      } else {
        game.reset(); // reset the game
      }
    }
  })

  // Blocks click hanlder
  blocks.on('click', function() {
    // If it's not the player turn or the block is already used
    if (!game.playerTurn || !game.clickable || this.className.indexOf('used') !== -1) {
      return null // do nothing
    } else {
      game.playerTurn = !game.playerTurn;
      game.playerBlocks[this.dataset.row].push(this.dataset.col);
      game.playerBlocks[this.dataset.row].sort();
      game.updateBlock($(this), game.player);

      game.checkWin('playerBlocks', this.dataset.col);
      game.computerTurn();
    }
  })


if (game.debug) {
  btnEl.addClass('debug');
  blocks.addClass('debug');
  $('.debug').on('click', function(){
    console.log(game);
  })
  console.log(game);
}


})
