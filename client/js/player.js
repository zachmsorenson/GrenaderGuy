var DEFAULT_SPEED = 180;

var Player = function (x, y, id, color) {

	this.spawnPoint = {x: x, y: y};
	this.id = id;
	this.speed = DEFAULT_SPEED;
	this.direaction = "down"; //up, down, left, right

	//use arcade physics
//	game.physics.enable(this, Phaser.Physics.ARCADE);

//    this.body.setSize(15, 16, 1, 15);

	//Wrapper for Player interactions handlers
	Player.prototype.handleInput = function () {
		this.handleMovementInput();
		this.handleBombInput();
	}

	Player.prototype.handleMovementInput = function () {

        var isMoving = true;
    
        
		if (game.input.keyboard.isDown(Phaser.keyboard.UP)) {
			this.body.velocity.x = 0;
            this.body.velocity.y = -this.speed;
			console.log("Pressed: UP");
		}
		else if (game.input.keyboard.isDown(Phaser.keyboard.DOWN)) {
			this.body.velocity.x = 0;
			this.body.velocity.y = this.speed;
		}
		else if (game.input.keyboard.isDown(Phaser.keyboard.RIGHT)) {
            this.body.velocity.y = 0;
            this.body.velocity.x = this.speed;
            console.log("Pressed: RIGHT");
		}
		else if (game.input.keyboard.isDown(Phaser.keyboard.LEFT)) {
			this.body.velocity.y = 0;
            this.body.velocity.x = -this.speed;
            console.log("Pressed: LEFT");
		}
		else {
            isMoving = false;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
		}

	}

	Player.prototype.handleBombInput = function () {
		if (game.input.keyboard.isDown(Phaser.keyboard.SPACEBAR)) {
			console.log("Pressed: SPACEBAR");
		}
	}
}

