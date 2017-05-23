//GLOBAL VARIABLES on scene.js
/*
var data;
var player1;
var player2;
var canvas;
var engine;
var scene;
var spheres = [];
var toDelete = [];
var enemyScore = 0;
var playerScore = 0;
*/

var socket;
var playerColor;


function initSocket() {
    //document.getElementById("play").style.setProperty("visibility", "hidden");
    document.getElementById("play").style.visibility = "hidden";
    socket = null;
    socket = io().connect();
    socket.on('connect', function () {
        playerColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        startBabylonEngine(playerColor); //on baylonMultiplayer.js
        var playerData = {
            x: player1.position.x,
            y: player1.position.y,
            z: player1.position.z,
            color: playerColor
        }
        socket.emit('start', playerData);
    });

    socket.on('handshake1', function (data) {
        if (player2) {
            player2.dispose();
        }
        player2 = createPlayer(scene, data.color, data);

        var playerData = {
            x: player1.position.x,
            y: player1.position.y,
            z: player1.position.z,
            color: playerColor
        }
        socket.emit('handshake2', playerData);
    });

    socket.on('handshake3', function (data) {
        player2 = createPlayer(scene, data.color, data);       
    });

    socket.on('setSpheres', function (coord) {
        setSpheres(coord);
    });

    socket.on('receiveUpdate', function (data) {
        player2.position.x = data.x;
        player2.position.y = data.y;
        player2.position.z = data.z;

        if (data.left) {
            player2.rotation.y -= 0.01;
        } else if (data.right) {
            player2.rotation.y += 0.01;
        }

        player2.position.x -= Math.cos(player2.rotation.y) * data.speed;
        player2.position.z += Math.sin(player2.rotation.y) * data.speed;

    });

    socket.on('spherePicked', function (sphereID) {
        var spherePicked = scene.getMeshByID(sphereID);
        if (spherePicked) {
            spherePicked.dispose();
        }
        enemyScore += 1;
        document.getElementById("enemyScore").textContent = "Enemy : " + enemyScore + "/25";
        if (enemyScore > 24) {
            gameOver("LOOSE");
        }
    });

    socket.on('bye', function (data) {
        if (player2) {
            player2.dispose()
        }
        for (i = 0; i < spheres.length; i++) {
            spheres[i].dispose();
        }
        playerScore = 0;
        enemyScore = 0;
        document.getElementById("playerScore").textContent = "You : " + playerScore + "/25";
        document.getElementById("enemyScore").textContent = "Enemy : " + enemyScore + "/25";
    });

}
