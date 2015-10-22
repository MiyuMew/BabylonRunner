// Ninja frame d'animation
// Idle : 0 - 39
// Walk : 40 - 85
// Run : 86 - 106
// Backstrafe : 107 - 177
// Left : 178 - 208
// Right : 209 - 240
// Jump : 241-276
// Slide : 

document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.getElementById("renderCanvas") ;
	var engine = new BABYLON.Engine(canvas, true) ;
	var scene = new BABYLON.Scene(engine);
	var loader = new BABYLON.AssetsManager(scene);

	var meshTask = loader.addMeshTask("player", "", "./assets/player/", "ninja.babylon");
	var player;
	var playerPosition = new BABYLON.Mesh("parent",scene);
	playerPosition.rotation.x = -Math.PI/2;
	meshTask.onSuccess =function(task) {
		player = task.loadedSkeletons;
		task.loadedMeshes.forEach(function(mesh) {
			mesh.parent = playerPosition;
		});

 		player.forEach(function(s) {
			scene.beginAnimation(s, 86, 106, true, 1); // On lance l'animation de course
 		});
	};

	loader.onFinish = function (tasks) {
		var camera = new BABYLON.ArcRotateCamera("mainCamera", 0,0,10,BABYLON.Vector3.Zero(), scene);
		var light = new BABYLON.HemisphericLight("mainLight", new BABYLON.Vector3(0,1,0), scene);
		scene.enablePhysics();
		scene.setGravity(new BABYLON.Vector3(0, -10, 0));
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas);

		var animationBoxJump = new BABYLON.Animation(
			"jump", 
			"position.y",
			30,
			BABYLON.Animation.ANIMATIONTYPE_FLOAT,
			BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
		);

		var keysJump = []; 
		for (var i = 0; i < 10; i+=0.1)
			keysJump.push({frame : i, value : -i * i + 10*i});
		keysJump.push({frame : 10, value : playerPosition.position.y});
		animationBoxJump.setKeys(keysJump);
		playerPosition.animations.push(animationBoxJump);	

		var onLeft = false;
		var positionFinale = BABYLON.Vector3.Zero();	

		window.addEventListener('keyup',function(event){
			if (event.keyCode == 90) // jump
			{
				player.forEach(function(s) {
					scene.beginAnimation(s, 241, 276, false, 1.5, function(){ scene.beginAnimation(s, 86, 106, true); });
		 		});
		 		scene.beginDirectAnimation(playerPosition, [animationBoxJump], 0,10,false,1);
			}
			else if (event.keyCode == 81) // left
			{
				onLeft = true;
				positionFinale = playerPosition.position.add(new BABYLON.Vector3(20,0,0));
				player.forEach(function(s) {
					scene.beginAnimation(s, 178, 208, false, 2, function(){ scene.beginAnimation(s, 86, 106, true); });
		 		});
			}
			else if (event.keyCode == 68) // right
			{
				player.forEach(function(s) {
					scene.beginAnimation(s, 209, 240, false, 1, function(){ scene.beginAnimation(s, 86, 106, true); });
		 		});
			}
			else if (event.keyCode == 83) // slide
			{
				player.forEach(function(s) {
					scene.beginAnimation(s, 277, 307, false, 1, function(){ scene.beginAnimation(s, 86, 106, true); });
		 		});
			}
		});

 		scene.registerBeforeRender(function(){
			if (onLeft)
			{
				if (playerPosition.position.x < positionFinale.x)
					playerPosition.position.x += 2;
				else
				{
					playerPosition.position = positionFinale;
					onLeft = false;
				}
			}
		});

		engine.runRenderLoop(function () {
			scene.render();
 		});
	};

	loader.load(); // Démarre le chargement
	scene.debugLayer.show();
}, false);

function movePlayer() 
{

}