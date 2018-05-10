var game = new Phaser.Game(24*32, 17*32, Phaser.AUTO, 'game');
// width = 24 tiles * 32 pixel width per tile
// height = 17 tiles * 32 pixel width per tile
game.state.add('Game', Game);

function startGame(){
    game.state.start('Game');
}
