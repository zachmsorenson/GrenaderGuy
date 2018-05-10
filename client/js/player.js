var DEFAULT_SPEED = 180;

var Player = function (x, y, id) {

	this.spawnPoint = {x: x, y: y};
	this.id = id;
	this.speed = DEFAULT_SPEED;
	this.direaction = "down"; //up, down, left, right

	//use arcade physics
	game.physics.enable(this, Phaser.Physics.ARCADE);


	//Wrapper for Player interactions handlers
	Player.prototype.handleInput = function () {
		this.handleMovementInput();
		this.handleBombInput();
	}

	Player.prototype.handleMovementInput = function () {

		if (game.input.keyboard.isDown(Phaser.keyboard.UP)) {
			//temporary:
			console.log("Pressed: UP");
		}
		else if (game.input.keyboard.isDown(Phaser.keyboard.DOWN)) {
			//temporary:
			console.log("Pressed: DOWN");
		}
		else if (game.input.keyboard.isDown(Phaser.keyboard.RIGHT)) {
			//temporary:
			console.log("Pressed: RIGHT");
		}
		else if (game.input.keyboard.isDown(Phaser.keyboard.LEFT)) {
			//temporary:
			console.log("Pressed: LEFT");
		}
		else {
		}

	}

	Player.prototype.handlBombInput = function () {
		if (game.input.keyboard.isDown(Phaser.keyboard.SPACEBAR)) {
			console.log("Pressed: SPACEBAR");
		}
	}
}

module.exports = Player;