//Player Logic
function Player(mark) {
  this.mark = mark;
}

Player.prototype.getMark = function (){
  return this.mark
}

//Space Logic
function Space(x, y) {
  this.x = parseInt(x);
  this.y = parseInt(y);
  this.marked = x + "_" + y;
  this.hasBeenMarked = false;
}
Space.prototype.xCoordinate = function(){
  return this.x;
}
Space.prototype.yCoordinate = function(){
  return this.y;
}
Space.prototype.markedBy = function (){
  return this.marked;
}
Space.prototype.mark = function(player){
  this.markedBy = player.mark();
}

//Board Logic
function Board() {
  this.spaces = [];
  this.layout = [[0,0,0],[0,0,0],[0,0,0]];
}
Board.prototype.find = function (x, y){
  x = parseInt(x);
  y = parseInt(y);
  for(let i = 0; i < this.spaces.length; i++){
    if(this.spaces[i].xCoordinate() === x && this.spaces[i].yCoordinate() === y){
      return this.spaces[i];
    }
  }
}

//Game Logic
function Game(board, p1, p2) {
  this.board = board;
  this.player1 = p1;
  this.player2 = p2;
  this.isOver = false;
  this.easyai = false;
  this.hardai = false;
}
//there are 8 victory states, 3 across, 3 down, 2 diagonals
Game.prototype.checkVictoryState = function(){
  if((this.board.spaces[0].markedBy() === this.board.spaces[1].markedBy() && this.board.spaces[1].markedBy() === this.board.spaces[2].markedBy())
  || (this.board.spaces[3].markedBy() === this.board.spaces[4].markedBy() && this.board.spaces[4].markedBy() === this.board.spaces[5].markedBy())
  || (this.board.spaces[6].markedBy() === this.board.spaces[7].markedBy() && this.board.spaces[7].markedBy() === this.board.spaces[8].markedBy())
  || (this.board.spaces[0].markedBy() === this.board.spaces[3].markedBy() && this.board.spaces[3].markedBy() === this.board.spaces[6].markedBy())
  || (this.board.spaces[1].markedBy() === this.board.spaces[4].markedBy() && this.board.spaces[4].markedBy() === this.board.spaces[7].markedBy())
  || (this.board.spaces[2].markedBy() === this.board.spaces[5].markedBy() && this.board.spaces[5].markedBy() === this.board.spaces[8].markedBy())
  || (this.board.spaces[0].markedBy() === this.board.spaces[4].markedBy() && this.board.spaces[4].markedBy() === this.board.spaces[8].markedBy())
  || (this.board.spaces[6].markedBy() === this.board.spaces[4].markedBy() && this.board.spaces[4].markedBy() === this.board.spaces[2].markedBy())){
    return true;
  }
  else{
    return false;
  }
}
Game.prototype.checkStaleMate = function(){
  for(let i = 0; i < this.board.spaces.length;i++){
    if(this.board.spaces[i].hasBeenMarked === false){
      return false;
    }
  }
  return true;
}

//Business Logic
var currentPlayer = new Player();

var newGame = function(){
  var Player1 = new Player("x");
  var Player2 = new Player("o");
  var TheBoard = new Board();
  for(let i  = 1; i < 4; i++){
    for(let j = 1; j < 4; j++){
      TheBoard.spaces.push(new Space(i, j));
    }
  }
  let newGame = new Game(TheBoard, Player1, Player2);
  return newGame;
}

//Clickspace drives the game loop
var clickSpace = function(ActiveGame, x, y){
  let thisSpace = ActiveGame.board.find(x,y);
  if(!thisSpace.hasBeenMarked){
    markSpace(ActiveGame, x, y);
    isGameOver(ActiveGame);
    if(!ActiveGame.isOver){
      switchPlayer(ActiveGame);
    }
  }
}
var markSpace = function (ActiveGame, x, y){
  let thisSpace = ActiveGame.board.find(x,y);
  thisSpace.marked = currentPlayer.getMark();
  if(currentPlayer === ActiveGame.player1){
    ActiveGame.board.layout[y-1][x-1] = 1;
  }else{
    ActiveGame.board.layout[y-1][x-1] = 5;
  }
  thisSpace.hasBeenMarked = true;
  console.log(ActiveGame.board.layout);
  $("#" + x + "_" + y).append('<img src="img/' + currentPlayer.getMark() + '.png">');
}
var switchPlayer = function(ActiveGame){
  if(currentPlayer === ActiveGame.player1){
    currentPlayer = ActiveGame.player2;
    if(ActiveGame.easyai === true){
      easyAITurn(ActiveGame);
    }else if(ActiveGame.hardai === true){
      //hard ai stuff
    }
  }else{
    currentPlayer = ActiveGame.player1;
  }
}
var isGameOver = function(ActiveGame){
  if(ActiveGame.checkVictoryState()){
    $(".victory").text(currentPlayer.getMark().toUpperCase() + " Wins!");
    ActiveGame.isOver = true;
  }else if(ActiveGame.checkStaleMate()){
    $(".victory").text("Stalemate! Nobody Wins!");
    ActiveGame.isOver = true;
  }

}
//EasyAI stuff
var easyAITurn = function(ActiveGame){
  let emptySpaces = [];
  for(let i = 0; i < ActiveGame.board.spaces.length; i++){
    if(!ActiveGame.board.spaces[i].hasBeenMarked){
      emptySpaces.push(ActiveGame.board.spaces[i]);
    }
  }
  let space = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  clickSpace(ActiveGame, space.xCoordinate(), space.yCoordinate());
}
/*  There are 8 scenarios for the hard ai to look for:
* 1: Win - can it win the game this move
* 2: Block - will the opponent win in their next move? if so block it
* 3: Fork - Create a fork so it has 2 ways to win
* 4: Block Fork - Block possible forks from the opponent
* 5: Center - take center space if available
* 6: Opposite corner - If the opponent is in the corner, the player plays the opposite corner.
* 7: Empty Corner - Take any empty corner
* 8: Empty Side - Take a middle square on any side
*/
//hard ai code starts here
var aiCheckForWin = function(ActiveGame){
  //check all 8 win scenarios I guess?
  let board = ActiveGame.board.layout;
  if(board[0][0] + board[0][1] + board[0][2] === 10){
    if(board[0][0] === 0)
      clickSpace(ActiveGame, 1, 1);
    if(board[0][1] === 0)
      clickSpace(ActiveGame, 1, 2);
    if(board[0][2] === 0)
      clickSpace(ActiveGame, 1, 3);
  }
  if(board[1][0] + board[1][1] + board[1][2] === 10){
    if(board[1][0] === 0)
      clickSpace(ActiveGame, 2, 1);
    if(board[1][1] === 0)
      clickSpace(ActiveGame, 2, 2);
    if(board[1][2] === 0)
      clickSpace(ActiveGame, 2, 3);
  }
  if(board[2][0] + board[2][1] + board[2][2] === 10){
    if(board[2][0] === 0)
      clickSpace(ActiveGame, 3, 1);
    if(board[2][1] === 0)
      clickSpace(ActiveGame, 3, 2);
    if(board[2][2] === 0)
      clickSpace(ActiveGame, 3, 3);
  }
  if(board[0][0] + board[1][0] + board[2][0] === 10){
    if(board[0][0] === 0)
      clickSpace(ActiveGame, 1, 1);
    if(board[1][0] === 0)
      clickSpace(ActiveGame, 2, 1);
    if(board[2][0] === 0)
      clickSpace(ActiveGame, 3, 1);
  }
  if(board[0][1] + board[1][1] + board[2][1] === 10){
    if(board[0][1] === 0)
      clickSpace(ActiveGame, 1, 2);
    if(board[1][1] === 0)
      clickSpace(ActiveGame, 2, 2);
    if(board[2][1] === 0)
      clickSpace(ActiveGame, 3, 2);
  }
  if(board[0][2] + board[1][2] + board[2][2] === 10){
    if(board[0][2] === 0)
      clickSpace(ActiveGame, 1, 3);
    if(board[1][2] === 0)
      clickSpace(ActiveGame, 2, 3);
    if(board[2][2] === 0)
      clickSpace(ActiveGame, 3, 3);
  }
  if(board[0][0] + board[1][1] + board[2][2] === 10){
    if(board[0][0] === 0)
      clickSpace(ActiveGame, 1, 1);
    if(board[1][1] === 0)
      clickSpace(ActiveGame, 2, 2);
    if(board[2][2] === 0)
      clickSpace(ActiveGame, 3, 3);
  }
  if(board[0][2] + board[1][1] + board[2][0] === 10){
    if(board[0][2] === 0)
      clickSpace(ActiveGame, 1, 3);
    if(board[1][1] === 0)
      clickSpace(ActiveGame, 2, 2);
    if(board[2][0] === 0)
      clickSpace(ActiveGame, 3, 1);
  }

}
var aiCheckForBlock = function(ActiveGame){

}
var aiCreateFork = function(ActiveGame){

}
var aiBlockFork = function(ActiveGame){

}
var aiCheckCenter = function(ActiveGame){

}
var aiOppositeCorner = function(ActiveGame){

}
var aiEmptyCorner = function(ActiveGame){

}
var aiEmptySide = function(ActiveGame){

}
var hardAITurn = function(ActiveGame){

}

//Front End
var clearBoard = function(){
  $(".well").text("");
  $(".victory").text("");
}
$(document).ready(function(){
  let ActiveGame = newGame();
  $("#2players").click(function(){
    clearBoard();
    ActiveGame = newGame();
    ActiveGame.easyai = false;
    ActiveGame.hardai = false;
    currentPlayer = ActiveGame.player1;
  });
  $("#easyai").click(function(){
    clearBoard();
    ActiveGame = newGame();
    ActiveGame.easyai = true;
    ActiveGame.hardai = false;
    currentPlayer = ActiveGame.player1;
  });
  $("#hardai").click(function(){

  });
  $(".well").click(function(){
    clickSpace(ActiveGame, this.id.slice(0,1), this.id.slice(2,3));
  });
});
