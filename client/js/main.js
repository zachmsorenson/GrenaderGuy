var game = new Phaser.Game(21*16, 21*16, Phaser.AUTO, 'game');
// width = 24 tiles * 32 pixel width per tile //width and height are 21 tiles * 16 pixels each
// height = 17 tiles * 32 pixel width per tile
game.state.add('Game', Game);

function startGame(players){
    Game.startPlayers = players;
    game.state.start('Game');
}
