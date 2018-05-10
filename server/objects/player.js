var Player = function(xInit, yInit, id){
    this.xInit = xInit;
    this.yInit = yInit;
    this.x = xInit;
    this.y = yInit;
    this.id = id;
    
    this.alive = true;
}

Player.prototype = {
    
}

module.exports = Player;
