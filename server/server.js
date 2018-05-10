var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

port = 8019;

app.use(express.static('client'));

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '../client/index.html');
});
*/
server.lastPlayerID = 0;

server.listen(port, function(){
    console.log('Listening on ' + port);
});

init();

function init() {
    setEventHandlers();

};

function setEventHandlers() {
    io.on('connection', function(client){
        client.on('newplayer', onNewPlayer);
        client.on('click', click);
        client.on('disconnect', onDisconnect);
    });
};

function onNewPlayer(){
    this.player = {
        id: server.lastPlayerID++,
        x: randomInt(100,400),
        y: randomInt(100,400)
    }
    this.emit('allplayers', getAllPlayers());
    this.broadcast.emit('newplayer', this.player);
}

function click(data){
    console.log('click to ' + data.x + ',' + data.y);
    this.player.x = data.x;
    this.player.y = data.y;
    io.emit('move', this.player);
}

function onDisconnect(){
    io.emit('remove', this.player.id);
}

/*
io.on('connection', function(socket){
    socket.on('newplayer', function(){ // Upon receiving a newplayer message, add the
        // player's data to the socket as an object
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('allplayers', getAllPlayers()); //send an allplayers message to the new connectee with 
                                                    //data on each existing player for their client
        socket.broadcast.emit('newplayer', socket.player); // send a newplayer message to each player with their data

        socket.on('click', function(data){
            console.log('click to ' + data.x + ',' + data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move', socket.player);
        });

        socket.on('disconnect', function(){
            io.emit('remove', socket.player.id);
        });
    });
});
*/

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
