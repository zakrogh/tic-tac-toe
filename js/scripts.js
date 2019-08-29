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
  currentPlayer = Player1;
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

    console.log(ActiveGame);
  }
}
var markSpace = function (ActiveGame, x, y){
  let thisSpace = ActiveGame.board.find(x,y);
  thisSpace.marked = currentPlayer.getMark();
  thisSpace.hasBeenMarked = true;
  $("#" + x + "_" + y).append('<img src="img/' + currentPlayer.getMark() + '.png">');
}
var switchPlayer = function(ActiveGame){
  if(currentPlayer.getMark() === ActiveGame.player1.getMark()){
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

var hardAITurn = function(ActiveGame){
  
}

//Front End
var clearBoard = function(){
  $(".well").text("");
  $(".victory").text("");
}
$(document).ready(function(){
  let ActiveGame = newGame();
  currentPlayer = ActiveGame.player1;
  $("#2players").click(function(){
    ActiveGame.easyai = false;
    ActiveGame.hardai = false;
    clearBoard();
    ActiveGame = newGame();
  });
  $("#easyai").click(function(){
    clearBoard();
    ActiveGame = newGame();
    ActiveGame.easyai = true;
  });
  $("#hardai").click(function(){

  });
  $(".well").click(function(){
    clickSpace(ActiveGame, this.id.slice(0,1), this.id.slice(2,3));
  });
});
