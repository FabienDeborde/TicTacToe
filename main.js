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
    debug: false,
    clickable: true,
    playerTurn: Boolean,
    finished: false,

    // Store the symbols of each side
    player: '',
    computer: '',

    // Store the used blocks
    playerBlocks: [],
    playerResult: [0,0,0,0,0,0,0,0],
    computerBlocks: [],
    computerResult: [0,0,0,0,0,0,0,0],
    usedBlocks: [],
    freeBlocks: [0,1,2,3,4,5,6,7,8],
    winningCombinations: [
      [0,1,2],
      [0,3,6],
      [0,4,8],
      [1,4,7],
      [2,5,8],
      [2,4,6],
      [3,4,5],
      [6,7,8]
    ],

    // Update the block text
    updateBlock: function(id, side) {
      var el = $('#' + id);
      el.text(game[side]);
      el.addClass('used');
    },

    // Manage new block
    manageBlocks: function(id, side) {
      var id = Number(id);
      // Update the block text
      game.updateBlock(id, side);

      // Add the new block to the corresponding array
      var blocks = side + 'Blocks';
      game[blocks].push(id);
      game[blocks].sort();

      // Add the new block to the used array
      game.usedBlocks.push(id);
      game.usedBlocks.sort();

      // Delete from free array the new block
      var index = game.freeBlocks.indexOf(Number(id));
      game.freeBlocks.splice(index, 1);

      //Check if someone won
      game.checkWin(id, side);

    },

    // Computer turn
    computerTurn: function() {
      if (game.computer === 'X' && game.freeBlocks.indexOf(4) !== -1) {
        game.manageBlocks(4, 'computer');
      } else if (!game.finished){
        // Find the combination the closest to completion
        var maxNumber = Math.max.apply(null, game.computerResult);
        var choicesAvailable = [];

        // Get all possibilities and push them inot choicesAvailable
        game.computerResult.map(function(number, index){
          if (number >= 0 && number === maxNumber) {
            game.winningCombinations[index].map(function(num, i){
              if (game.freeBlocks.indexOf(num) !== -1) {
                choicesAvailable.push(num);
                choicesAvailable.sort();
              }
            })
          } else if (maxNumber < 0) {
            game.winningCombinations[index].map(function(num, i){
              if (game.freeBlocks.indexOf(num) !== -1) {
                choicesAvailable.push(num);
                choicesAvailable.sort();
              }
            })
          }
        })
        var randomChoice = choicesAvailable[Math.floor(Math.random() * choicesAvailable.length)];
        setTimeout(function () {
          game.manageBlocks(randomChoice, 'computer');
        }, 500);
      }
      // Update playerTurn
      setTimeout(function () {
        game.playerTurn = true;
      }, 600);

    },

    // Check if the game is done
    checkWin: function(id, side) {
      var win = false;
      var result = game[side + 'Result'];
      // Map the winning combination array
      game.winningCombinations.map(function(combination, index){
        if (combination.indexOf(Number(id)) !== -1) { // if the clicked block is in a combination
          result[index] += 1; // increment by 1 the corresponding result
        }
      })
      // When the 3 numbers of a combination are found
      if (result.indexOf(3) !== -1) {
        win = true; // set win to true
      }
      // If a side won
      if (win && side === 'player') { // and it's the computer
        game.finished = true;
        game.winningPopup(); // game over
      } else if (win && side === 'computer') { // and it's the player
        game.finished = true;
        game.gameOverPopup(); // you win
      } else if (!win && game.freeBlocks.length === 0) { // If there are no block left and no one won
        game.finished = true;
        game.tiePopup();
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
      game.togglePopup();
      popupEl.attr('id', 'tie');
      game.updatePopup('It\'s a tie!', 'Stop', 'Play again');
    },
    winningPopup: function() {
      game.togglePopup();
      popupEl.attr('id', 'win');
      game.updatePopup('You won!', 'Stop', 'Play again');
    },
    gameOverPopup: function() {
      game.togglePopup();
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
      game.finished = false;
      game.playerTurn = Boolean;
      game.player = '';
      game.computer = '';
      game.playerBlocks = [];
      game.playerResult = [0,0,0,0,0,0,0,0],
      game.computerBlocks = [];
      game.computerResult = [0,0,0,0,0,0,0,0],
      game.usedBlocks = [];
      game.freeBlocks = [0,1,2,3,4,5,6,7,8];
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
      var id = $(this).attr('id');
      game.manageBlocks(id, 'player');
      // Map the winning combination array
      game.winningCombinations.map(function(combination, index){
        if (combination.indexOf(Number(id)) !== -1) { // if the clicked block is in a combination
          game.computerResult[index] -= 10; // decrease by 10 this combination score in computerResult
        }
      })
      game.computerTurn();
    }
  })

// Debug function
if (game.debug) {
  btnEl.addClass('debug');
  blocks.addClass('debug');
  $('.debug').on('click', function(){
    console.log(game);
  })
  console.log(game);
}


})
