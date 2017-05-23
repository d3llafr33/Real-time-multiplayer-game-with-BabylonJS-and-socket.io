var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/'));

var roomQueue = [];     
var roomQueueFull = [];
var counterRooms = 0;
//key:value  --> key:client , value:room's client
var usersConnected = {}; 


io.on('connection', function (socket) {
    console.log("Client " + socket.id + " connected");
    socket.on('start', function (playerData) {
        counterRooms += 1;
        roomName = "room" + counterRooms;
        usersConnected[socket.id] = roomName;

        if (roomQueue[0]) {
            var room = roomQueue.shift();         
            var clientsInRoom = io.sockets.adapter.rooms[room];
            if (clientsInRoom.length == 1) {
                roomQueueFull.push(room);                
            }
            usersConnected[socket.id] = room;
            socket.join(room);
            socket.broadcast.to(room).emit('handshake1', playerData);
        } else {
            roomQueue.push(usersConnected[socket.id]);
            socket.join(roomName);
        }
    });

    socket.on('handshake2', function (playerData) {
        socket.broadcast.to(usersConnected[socket.id]).emit('handshake3', playerData);
        var coords = [];
        var i;
        for (i = 0; i < 50; i++) {
            var c = {
                x: Math.floor(Math.random() * 1001) - 500,
                y: 2.5,
                z: Math.floor(Math.random() * 1001) - 500
            }
            coords.push(c);
        }
        socket.broadcast.to(usersConnected[socket.id]).emit('setSpheres', coords);
        coords.forEach(function (coord) {
            coord.x = -coord.x;
            coord.z = -coord.z;
        });
        socket.emit('setSpheres', coords);        
    });

    socket.on('sendUpdate', function (data) {
        socket.broadcast.to(usersConnected[socket.id]).emit('receiveUpdate', data);
    });

    socket.on('hit', function (idSphere) {
        socket.broadcast.to(usersConnected[socket.id]).emit('spherePicked', idSphere);
    });

    socket.on('gameOver', function () {
        socket.disconnect();
    });

    socket.on('disconnect', function () {
        console.log("Client " + socket.id + " disconnected");
        var roomClientRemoved = usersConnected[socket.id];
        delete usersConnected[socket.id];

        var index = roomQueueFull.indexOf(roomClientRemoved);
        if (index > -1) {
            roomQueueFull.splice(index, 1);
            roomQueue.push(roomClientRemoved);
        } else {
            index = roomQueue.indexOf(roomClientRemoved)
            if (index > -1) {
                roomQueue.splice(index, 1)
            }
        }
        socket.broadcast.to(roomClientRemoved).emit('bye', "");
    });
});

server.listen(8001, 'localhost', function () {
    var host = server.address().address
    var port = server.address().port
    console.log("\nServer running http://%s:%s", host, port)
});
