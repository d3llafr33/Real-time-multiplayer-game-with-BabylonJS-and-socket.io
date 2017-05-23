//var data;
var player1;
var player2;
var canvas;
var engine;
var scene;
var spheres = [];
var toDelete = [];
var enemyScore = 0;
var playerScore = 0;

function createMultiplayerScene(color) {
    canvas = document.getElementById("multiplayerCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);

    player1 = createPlayer(scene, color, null);

    var camera = getFollowCamera(scene, player1);
    camera.attachControl(canvas, true);

    var light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), scene);


    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
    ground.material = new BABYLON.StandardMaterial("ground", scene);
    ground.material.diffuseColor = new BABYLON.Color3(0.529, 0.808, 0.922)
    ground.material.specularColor = new BABYLON.Color3(0, 0, 0)
    ground.position.y = -2;

    var border = createBorder(scene);
    //KEYS
    var turnLeft = false;
    var turnRight = false;
    var go = false;
    var stop = false;
    var update = false;
    window.addEventListener("keydown", function (evt) {
        update = true;
        if (!scene)
            return;

        //W --> 87  ||  up      --> 38
        //S --> 83  ||  back    --> 40
        //D --> 68  ||  right   --> 39      
        //A --> 65  ||  left    --> 37

        //W
        if (evt.keyCode == 87) {
            go = true;
            stop = false;
        }
        //S
        if (evt.keyCode == 83) {
            stop = true;
            go = false;
        }
        //Key LEFT
        if (evt.keyCode == 65) {
            turnLeft = true;
            turnRight = false;
        }
        //Key RIGHT
        if (evt.keyCode == 68) {
            turnLeft = false;
            turnRight = true;
        }
    });

    window.addEventListener("keyup", function (evt) {
        update = true;
        if (evt.keyCode == 65 || evt.keyCode == 68) {
            turnLeft = false;
            turnRight = false;
        }
        if (evt.keyCode == 87 || evt.keyCode == 83) {
            go = false;
            stp = false;
        }
    });

    var speed = 0;
    scene.registerBeforeRender(function () {
        if (scene.isReady()) {
            if (go && speed < 1) {
                speed += 0.05;

            } else if (speed > 0 && stop) {
                speed -= 0.5;
            } else if (speed > 0 && !stop) {
                speed -= 0.05;
            }
            else if (Math.round(speed) == 0) {
                speed = 0;

            }
            if (turnLeft) {
                player1.rotation.y -= 0.01;
            } else if (turnRight) {
                player1.rotation.y += 0.01;
            }

            player1.position.x -= Math.cos(player1.rotation.y) * speed;
            player1.position.z += Math.sin(player1.rotation.y) * speed;
            
            if (player2 && update) {
                coord = {
                    x: -player1.position.x,
                    y: player1.position.y,
                    z: -player1.position.z,
                    speed: speed,
                    left: turnLeft,
                    right: turnRight,
                }
                socket.emit('sendUpdate', coord);
            }
        }
    });
    return scene;
}
 
function startBabylonEngine(color) {
    if (BABYLON.Engine.isSupported()) {
        var scene = createMultiplayerScene(color);
        engine.displayLoadingUI();
        scene.executeWhenReady(function () {
            engine.runRenderLoop(function () {
                engine.hideLoadingUI();
                scene.render();
            });
        });
        window.addEventListener("resize", function () {
            engine.resize();
        });
    } else {
        alert("I'm sorry!");
    }
};


function setSpheres(coord) {
    player1.actionManager = new BABYLON.ActionManager(scene); 

    for (i = 0; i < 50; i++) {
        var sphere = BABYLON.Mesh.CreateSphere("sphere"+i, 5.0, 5.0, scene);
        sphere.position = coord[i]
        spheres.push(sphere);
    }
    spheres.forEach(function (sphere) {
        player1.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: sphere }, function () {
            sphere.dispose();
            socket.emit('hit', sphere.id);
            playerScore += 1;
            document.getElementById("playerScore").textContent = "You : " + playerScore + "/25";
            if (playerScore > 24) {
                gameOver("WIN");
            }
        }));
    });
}