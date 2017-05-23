function getFollowCamera(scene, target) {
    var camera = new BABYLON.FollowCamera("myFollowCamera", new BABYLON.Vector3(490, 10, 0), scene);
    camera.heightOffset = 30;       
    camera.radius = 80;             
    camera.rotationOffset = 90;     
    camera.cameraAcceleration = 0.05 
    camera.target = target;
    return camera;
};

function createPlayer(scene, color, data) {
    var meshes = [];
    var cylinder = new BABYLON.Mesh.CreateCylinder("cylinder", 10, 6, 6, 6, 1, scene, false);
    cylinder.rotation.x = Math.PI / 2;
    var cylinder2 = cylinder.clone();
    cylinder2.position.x += cylinder.position.x + 4;
    var cylinder3 = cylinder.clone();
    cylinder3.position.x += cylinder.position.x - 4;
    var cube = new BABYLON.Mesh.CreateBox("box", 4, scene);
    cube.position.y = cylinder.position.y + 3;
    cube.scaling = new BABYLON.Vector3(2.5, 0.4, 1.8);
    var cylinder4 = new BABYLON.Mesh.CreateCylinder("cylinder", 5, 6, 6, 5, 1, scene, false);
    cylinder4.rotation.x = Math.PI / 2;
    cylinder4.position.y = cube.position.y + 1;
    cylinder4.position.x = cube.position.x + 2;
    var cylinder5 = new BABYLON.Mesh.CreateCylinder("cylinder", 10, 2, 2, 6, 1, scene, false);
    cylinder5.position = new BABYLON.Vector3(-3, cube.position.y + 4, 0);
    cylinder5.rotation.z = Math.PI / 2.2;
    meshes.push(cylinder);
    meshes.push(cylinder2);
    meshes.push(cylinder3);
    meshes.push(cube);
    meshes.push(cylinder4);
    meshes.push(cylinder5);
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = color;
    mat.backFaceCulling = false;
    var tunk = BABYLON.Mesh.MergeMeshes(meshes);
    tunk.name = "tunk";
    tunk.material = mat;     
    if (data) {
        tunk.position.y = data.y;
        tunk.position.x = -data.x;
        tunk.position.z = data.z;
        tunk.rotation.y = Math.PI
    } else {
        tunk.position.y = -1;
        tunk.position.x = 400;
        tunk.position.z = 0;
        tunk.rotation.y = 0
    }

    tunk.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
    tunk.layerMask = 2;
    return tunk;
};

function gameOver(result) {
    engine.stopRenderLoop();
    document.getElementById("gameOver").style.visibility = "visible";
    document.getElementById("gameResult").textContent = "YOU " + result;
    socket.emit('gameOver', "");
}

function createBorder(scene) {
    var meshes = [];
    var box = BABYLON.Mesh.CreateBox("box", 10.0, scene);
    box.scaling.x = 0.2
    box.scaling.z = 100
    box.position.x = 500

    box2 = box.clone();
    box2.position.x = -box.position.x

    box3 = box.clone();
    box3.rotation.y = Math.PI / 2
    box3.position.x = 0
    box3.position.z = 499, 5;

    box4 = box3.clone();
    box4.position.z = -box3.position.z

    meshes.push(box);
    meshes.push(box2);
    meshes.push(box3);
    meshes.push(box4);

    var border = BABYLON.Mesh.MergeMeshes(meshes);
    border.material = new BABYLON.StandardMaterial("ground", scene);
    border.material.diffuseColor = new BABYLON.Color3(0.529, 0.808, 0.922)
    border.material.specularColor = new BABYLON.Color3(0, 0, 0)
    return border;
}