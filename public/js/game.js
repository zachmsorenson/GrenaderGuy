var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function(){
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
    game.load.image('sprite', 'assets/sprites/sprite.png');
};

Game.create = function(){
    Game.playerMap = {};
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) { // create each layer specified by map
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on map
    Client.askNewPlayer();

    layer.events.onInputUp.add(Game.getCoordinates, this);
};

Game.addNewPlayer = function(id, x, y){ // add a new player to the game map
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite'); // the player in the player map id with
    // passed id is added to the game with a sprite
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.getCoordinates = function(layer, pointer){
    Client.sendClick(pointer.worldX, pointer.worldY);
};

Game.movePlayer = function(id, x, y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x, player.y, x, y);
    var duration = distance*10;
    var tween = game.add.tween(player);
    tween.to({x:x, y:y}, duration);
    tween.start();
};
