var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

port = 8019;

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('assets', express.static(__dirname + '/public/assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, function(){
    console.log('Listening on ' + port);
});
