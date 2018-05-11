var Client = {};
Client.socket = io.connect();
init();

function init(){
    setEventHandlers();
}

function setEventHandlers(){
    socket = Client.socket;

    socket.on('newplayer', newPlayer);
    socket.on('allplayers', allPlayers);
    socket.on('remove', remove);
    socket.on('start game', startGame);
    socket.on('move', move);
};
Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

function newPlayer(data){
    Game.addNewPlayer(data.id, data.x, data.y);
}

function allPlayers(data){
    for (var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    }
}

function remove(id){
    Game.removePlayer(id);
}

function move(data){
    Game.movePlayer(data.id, data.x, data.y);
}

//Mouse-click movement
Client.sendClick = function(x, y){
    Client.socket.emit('click', {x:x, y:y});
};

function sendStartGame(){
    Client.socket.emit('start game');
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
