var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function(){
    // Load everything you will need to do
    game.load.tilemap('map', 'assets/map/secondTilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/simples_pimples.png', 16, 16);
    game.load.image('sprite', 'assets/sprites/player-1.png');
    game.load.image('crater-1', 'assets/sprites/crater-1.png');
};

Game.create = function(){

    // Set up and start the game
    Game.playerMap = {};

    // add tilemap to game
    //enable arcade phyics
    game.physics.startSystem(Phaser.Physics.ARCADE);

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    var map = game.add.tilemap('map');
    Game.map = map;
    // add the tileset ontop of the tilemap
    map.addTilesetImage('opensTileset', 'tileset');
    map.addTilesetImage('crater', 'crater-1');

    // set up layers for tilemap
    var backgroundLayer = map.createLayer('backgroundLayer');
    var blockedLayer = map.createLayer('blockedLayer');
    var objectLayer = map.createLayer('objectLayer');
    console.log(objectLayer);

    map.setCollisionBetween(1, 5000, true, blockedLayer);
    map.setCollisionBetween(1, 5000, true, objectLayer);
    
    backgroundLayer.inputEnabled = true; // Allows clicking on map

    backgroundLayer.events.onInputUp.add(Game.getCoordinates, this);

    backgroundLayer.resizeWorld();

    Game.createItems();
};

Game.findObjectsByType = function(type, map, layer){
	var result = new Array();
	console.log(map);
	map.objects.objectLayer.forEach(function(element){
		if(element.type === type){
			element.y -= map.tileHeight;
			result.push(element);
		}
	});
	return result;
}

Game.createFromTiledObject = function(element, group){
	var sprite = group.create(element.x, element.y, 'crater-1');
}

Game.createItems = function(){
	items = game.add.group();
	items.enableBody = true;
	var item;
	result = Game.findObjectsByType('breakable', Game.map, 'objectLayer');
	console.log(result);
	result.forEach(function(element){
		Game.createFromTiledObject(element, items);
	}, Game);
}

Game.update = function () {
    //var player = this.playerMap[0];
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        Client.sendMove("LEFT");
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        Client.sendMove("RIGHT");
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        Client.sendMove("UP");
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        Client.sendMove("DOWN");
    }

}

Game.addNewPlayer = function(id, x, y){ // add a new player to the game map
     // the player in the player map id with
    var sprite = game.add.sprite(x, y, 'sprite');
    game.physics.arcade.enable(sprite);
    console.log(Game);
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite'); 
    game.physics.arcade.enable(Game.playerMap[id]);

    //create new player
   // Game.playerMap[id] = game.add.sprite(x, y, 'sprite'); // the player in the player map id with
    // passed id is added to the game with a sprite
};



Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.getCoordinates = function(layer, pointer){
    console.log("Got an input from client");
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

