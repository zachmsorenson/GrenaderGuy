var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

port = 8019;

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/assets', express.static(__dirname + '/public/assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

server.lastPlayerID = 0;

server.listen(port, function(){
    console.log('Listening on ' + port);
});



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
