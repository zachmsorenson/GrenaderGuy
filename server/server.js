var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var Game = require('./objects/game.js');
var Player = require('./objects/player.js');
//var Lobby = require('./objects/lobby.js');

port = 8019;
app.use(express.static('client'));

server.listen(port, function(){
    console.log('Listening on ' + port);
});

var lastPlayerID = 0;
var lastBombID = 0;

var game = new Game();
init();

function init() {
    // Listen for events
    setEventHandlers();
    
    // Game loop
    setInterval(gameLoop, 200);
};

function setEventHandlers() {
    io.on('connection', function(client){
        console.log('Player connection: ' + client.id);

        client.on('newplayer', onNewPlayer);
        client.on('click', click);
        client.on('disconnect', onDisconnect);

  //      client.on('join room', Lobby.onJoinRoom);
        client.on('join room', Lobby.onJoinRoom);
        client.on('right', moveRight);
        client.on('left', moveLeft);
        client.on('down', moveDown);
        client.on('up', moveUp);
    });
};
function onNewPlayer() {
	this.player = {
		id: server.lastPlayerID++,
		x: randomInt(100, 400),
		y: randomInt(100, 400)
	}
	this.emit('allplayers', getAllPlayers());
	this.broadcast.emit('newplayer', this.player);
}

function onNewPlayer(){
    this.player = {
        id: lastPlayerID++,
        x: randomInt(100,400),
        y: randomInt(100,400),
        alive: true,
        hasMoved: false
    }
    game.players[this.player.id] = this.player;
    console.log(game);
    console.log(game.players);
    this.emit('allplayers', getAllPlayers());
    this.broadcast.emit('newplayer', this.player);
function moveRight (data) {
    this.player.x = data.x + 20;
    io.emit('move_direction', this.player);

}
function moveLeft (data) {
	this.player.x = data.x - 20;
	io.emit('move_direction', this.player);
}
function moveDown (data) {
	this.player.y = data.y - 20;
	io.emit('move_direction', this.player);
}
function moveUp (data) {
	this.player.y = data.y + 20;
	io.emit('move_direction', this.player);
}

function click(data){
    if (this.player){
        console.log('click to ' + data.x + ',' + data.y);
        this.player.hasMoved = true;
        this.player.x = data.x;
        this.player.y = data.y;
        //console.log(this.player);
        //io.emit('move', this.player);
    }
}

function onDisconnect(){
    if (this.player){
        io.emit('remove', this.player.id);
    }
}

function onDropBomb(data){
    if (this.player){
        var player = this.player;
        var bomb = new Bomb(player.x, player.y, lastBombID);
        io.emit('drop bomb', bomb);
    }
}

function onMovePlayer(data) {
    var player = this.player;
}

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player){
            players.push(player);
        }
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function gameLoop() {
    // on each loop, check if a player has moved.
    // if they have, emit that move
//    for(var game in games){
//        var game = games[game];
        for(var i in game.players) {
            var player = game.players[i]; // for each player
            if(player.alive && player.hasMoved) {
                io.emit('move', player);
                player.hasMoved = false;
            }
        }
//    }
}    
