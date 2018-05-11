// Game object keeps track of data necessary for the game

var Game = function() { // Game data
    this.players = []; // object holds each player in a game
    this.map = {}; // map data
    this.bombs = []; //bomb array
}

Game.prototype = { // Game methods
    get numPlayers(){
        return Object.keys(this.players).length
    }
}

module.exports = Game;
