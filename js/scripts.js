//Player Logic
function Player(mark) {
  this.mark = mark;
}

Player.prototype.mark = function (){
  return this.mark
}
//Space Logic
function Space(x, y) {
  this.x = x;
  this.y = y;
  this.markedBy;

}
Space.prototype.xCoordinate = function(){
  return this.x;
}
Space.prototype.yCoordinate = function(){
  return this.y;
}
Space.prototype.markedBy = function (){

}
Space.prototype.mark = function(player){

}

//Board Logic
function Board() {
  this.spaces = [];

}
Board.prototype.find = function (x, y){
  this.spaces.forEach(function (space){
    if(this.xCoordinate() === x && this.yCoordinate() === y){
      return space;
    }
  });
}

//Game Logic
function Game(board, p1, p2) {
  this.board = board;
  this.player1 = p1;
  this.player2 = p2;
}
//Business Logic
var newGame = function(){
  var Player1 = new Player("X");
  var Player2 = new Player("Y");
  var TheBoard = new Board();
  for(let i  = 1; i < 4; i++){
    for(let j = 1; j < 4; j++){
      TheBoard.spaces.push(new Space(i, j));
    }
  }
  return [TheBoard, Player1, Player2];
}

//Front End
$(document).ready(function(){
  $("#button").click(function(){
    ActiveGame = new Game(newGame());
    console.log(ActiveGame);
  });
});
