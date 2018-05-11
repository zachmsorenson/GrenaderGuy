var Client = {};
Client.socket = io.connect();
init();

function init(){
    setEventHandlers();
}

function setEventHandlers(){
    socket = Client.socket;
    socket.isAlive = true;

    socket.on('newplayer', newPlayer);
    socket.on('allplayers', allPlayers);
    socket.on('remove player', onRemove);
    socket.on('start game', startGame);
    socket.on('move', move);
    socket.on('users', onUsers);
    socket.on('submitted', onSubmitted);
    socket.on('place bomb', onPlaceBomb);
    socket.on('explode', onExplode);
};
Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendMove = function(id, x, y){
    Client.socket.emit('move', {id:id, x:x, y:y});
}

function newPlayer(data){
//    Game.addNewPlayer(data.id, data.x, data.y);
}

function allPlayers(data){
    for (var i = 0; i < data.length; i++){
//        Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    }
}

function onUsers(data){
    console.log('got users message:');
    console.log(data);
    displayUsers(data);
}

function onRemove(data){
//    console.log('received a remove message for some reason');
    Game.removePlayer(data.id);
}

function move(data){
    if (data.id != Game.myID){
        Game.movePlayer(data.id, data.x, data.y);
    }
}

//Mouse-click movement
Client.sendClick = function(x, y){
    Client.socket.emit('click', {x:x, y:y});
};

function sendStartGame(){
    Client.socket.emit('start game');
}

Client.submitPlayer = function(username, color){
    Client.socket.emit('submit player', {username: username, color: color});
}

function onSubmitted(data){
    Game.myID = data.id;
}

Client.destroyPlayer = function(player){
    //console.log('test');
    if(Client.socket.isAlive){
        Client.socket.emit('destroy player', {id: player.id});
        console.log('destroyed');
        console.log(player);
    }
    Client.socket.isAlive = false;
    //console.log("SENT DESTROY PLAYER MESSAGE" + player.id);
}

function onPlaceBomb(data){
    Game.placeBomb(data.x, data.y, data.id);    
}

Client.placeBomb = function(x, y){
    Client.socket.emit('place bomb', {x:x, y:y});
}

function onExplode(data){
    Game.explode(data);
}

///////ADDED BY WILL FOR MOVEMENT///////////////
Client.sendRight = function (x, y) {
    Client.socket.emit('right', {x:x, y:y});
};
Client.sendLeft = function (x, y) {
	Client.socket.emit('left', {x:x, y:y});
};
Client.sendUp = function (x, y) {
	Client.socket.emit('up', {x:x, y:y});
};
Client.sendDown = function (x, y) {
	Client.socket.emit('down', {x:x, y:y});
};

Client.socket.on('move_direction', function (data) {
    Game.movePlayer(data.id, data.x, data.y);
});
///////END: ADDED BY WILL FOR MOVEMENT///////////////
