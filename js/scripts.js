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
  this.marked = "";
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
}
//Business Logic
var currentPlayer = new Player();

var newGame = function(){
  var Player1 = new Player("X");
  var Player2 = new Player("Y");
  var TheBoard = new Board();
  for(let i  = 1; i < 4; i++){
    for(let j = 1; j < 4; j++){
      TheBoard.spaces.push(new Space(i, j));
    }
  }
  let newGame = new Game(TheBoard, Player1, Player2);
  return newGame;
}
var clickSpace = function(ActiveGame, x, y){
  let thisSpace = ActiveGame.board.find(x,y);
  if(!thisSpace.markedBy()){
    markSpace(ActiveGame, x, y);
  }
}
var markSpace = function (ActiveGame, x, y){
  let thisSpace = ActiveGame.board.find(x,y);
  thisSpace.marked = currentPlayer.getMark();
  console.log(thisSpace);
}
var isGameOver = function(){

}
//Front End
var clearBoard = function(){
  $(".well").text("");
}
$(document).ready(function(){
  var ActiveGame = newGame();
  currentPlayer = ActiveGame.player1;
  $("#button").click(function(){
    clearBoard();
    ActiveGame = newGame();
    console.log(ActiveGame);
  });
  $(".well").click(function(){
    clickSpace(ActiveGame, this.id.slice(0,1), this.id.slice(2,3));
  });
  console.log(ActiveGame);
});
