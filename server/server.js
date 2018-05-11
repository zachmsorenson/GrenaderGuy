var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var Game = require('./objects/game.js');
var Player = require('./objects/player.js');
var Bomb = require('./objects/bomb.js');
//var Lobby = require('./objects/lobby.js');

port = 8023;
app.use(express.static('client'));

server.listen(port, function(){
    console.log('Listening on ' + port);
});

var lastPlayerID = 0;
var lastBombID = 0;

var users = [];

var game = new Game();
init();

function init() {
    // Listen for events
    setEventHandlers();

    // Game loop
    setInterval(gameLoop, 50);
}

function setEventHandlers() {
    io.on('connection', function(client){
        console.log('Player connection: ' + client.id);

        client.on('newplayer', onNewPlayer);
//        client.on('click', click);
        client.on('disconnect', onDisconnect);
        client.on('start game', startGame);
        client.on('place bomb', onPlaceBomb);
        client.on('destroy player', onDestroyPlayer);

        client.on('submit player', submitPlayer);
  //      client.on('join room', Lobby.onJoinRoom);
        client.on('move', onMove);
    });
}

function onNewPlayer() {
	this.emit('allplayers', getAllPlayers());
	this.broadcast.emit('newplayer', this.player);
}

function onMove(data){
    var player = this.player;
    this.player.x = data.x;
    this.player.y = data.y;
    this.player.hasMoved = true;
}

function startGame(){
    console.log('recieved start game message');

    Object.keys(io.sockets.connected).forEach(function(socketID){
        var socket = io.sockets.connected[socketID];
        console.log('does socket have user ' + socket.user);

        if (socket.user){ // socket is a user - add to game
            id = socket.user.id;
            if (id == 0 || id == 2){
                var xSpawn = 16;
            } else {
                var xSpawn = 304;
            }

            if (id == 0 || id == 1){
                var ySpawn = 16;
            } else {
                var ySpawn = 304;
            }
        
            socket.player = {
                id: socket.user.id,
                color: socket.user.color,
                x: xSpawn,
                y: ySpawn,
                alive: true,
                hasMoved: false
            }
            game.players[socket.player.id] = socket.player;
        }
    });
    io.sockets.emit('start game', getAllPlayers());
    setTimeout(function(){
        io.sockets.emit('allplayers', getAllPlayers());
    }, 500);
}

function submitPlayer(data){
    var username = data.username;
    var color = data.color;

    if(users.filter(e => e.username === username).length == 0 && users.length < 4){
        var user = { id: lastPlayerID++, username: username, color: color};
        users.push(user);
    }

    this.user = user;
    this.emit('submitted', user);
    io.sockets.emit('users', users);
}
    
function onDisconnect(){
    console.log(io.sockets.connected.length);
    if (Object.keys(io.sockets.connected).length === 0){
        // game is empty restart i
        console.log("empty");
        game = new Game();
        lastPlayerID = 0;
    }
    if (this.player){
        console.log('want to send a remove message');
        //io.emit('remove', this.player.id);
    }
}

function onDestroyPlayer(data){
    
    console.log('server destroy player message');
    console.log(data);
    var player = game.players[data.id];
    player.alive = false;
    io.emit('remove player', {id: data.id});
}

function onPlaceBomb(data){
    var player = game.players[this.player.id];

    var bombId = lastBombID++;

    var bombTimeoutId = setTimeout(function() {
        console.log("detonation");

        io.emit('explode', game.bombs[bombId]);

        delete game.bombs[bombId];


    }, 2000);

    var bomb = new Bomb(player.x, player.y, bombId);
    console.log(bomb);
    game.bombs[bombId] = bomb;
    console.log(game.bombs);
    
    io.emit('place bomb', bomb);
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
    for(var i in game.players) {
        var player = game.players[i]; // for each player
        //console.log(player);
        if(player.alive && player.hasMoved) {
            //console.log("player moved sent");
            io.emit('move', player);
            player.hasMoved = false;
        }
    }
} 

