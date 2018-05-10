
var rooms = {};
var roomId = 0;
var numRooms = 4;

var Room = {
    getRooms: function() {
        return rooms;
    },

    getRoomId: function() {
        return roomId;
    },

    getNumRooms: function() {
        return numRooms;
    }

    onJoinRoom: function(data) {
        this.join(roomName);
    }
};

module.exports = Room;
