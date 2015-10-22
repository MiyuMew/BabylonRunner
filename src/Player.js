function Player (game)
{
	this.game = game;
	this.mesh;
	this.playerPosition = new BABYLON.Mesh("playerPosition",this.game.scene);
	this.onLeft = false;
	this.onRight = false;
	this.onStrike = false;
	this.onJump = false;
	this.positionFinale = BABYLON.Vector3.Zero();
}
Player.prototype.constructor = Player;

Player.prototype.load = function ()
{
	var that = this;
	this.game.loader.add("mesh","player","./assets/player/", "ninja.babylon", function(task){
		that.mesh = task;
		that.mesh.loadedMeshes.forEach(function(mesh) {
			mesh.parent = that.playerPosition;
		});

 		that.mesh.loadedSkeletons.forEach(function(s) {
			that.game.scene.beginAnimation(s, 86, 106, true, 1);
 		});
	});
}

Player.prototype.init = function ()
{
	var that = this;
	this.playerPosition.rotation.x = -Math.PI/2;
	this.playerPosition.rotation.y = Math.PI;
	this.playerPosition.position.z = -4;

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
	keysJump.push({frame : 10, value : this.playerPosition.position.y});
	animationBoxJump.setKeys(keysJump);
	this.playerPosition.animations.push(animationBoxJump);

	window.addEventListener('keyup',function(event){
		if (event.keyCode == 90) // jump
		{
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 241, 276, false, 1.5, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
	 		that.game.scene.beginDirectAnimation(that.playerPosition, [animationBoxJump], 0,10,false,1);
		}
		else if (event.keyCode == 81) // left
		{
			that.onLeft = true;
			that.positionFinale = that.playerPosition.position.add(new BABYLON.Vector3(-10,0,0));
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 178, 208, false, 2, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
		}
		else if (event.keyCode == 68) // right
		{
			that.onRight = true;
			that.positionFinale = that.playerPosition.position.add(new BABYLON.Vector3(10,0,0));
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 209, 240, false, 1, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
		}
		else if (event.keyCode == 83) // slide
		{
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 277, 307, false, 1, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
		}
	});

	this.game.loop();
}

Player.prototype.move = function()
{
	var that = this;
	this.game.scene.registerBeforeRender(function(){
		if (that.positionFinale.x >= -10 && that.positionFinale.x <= 10)
		{
			if (that.onLeft)
			{
				if (that.playerPosition.position.x > that.positionFinale.x)
					that.playerPosition.position.x -= 0.01;
				else
				{
					that.playerPosition.position = that.positionFinale;
					that.onLeft = false;
				}
			}
			else if (that.onRight)
			{
				if (that.playerPosition.position.x < that.positionFinale.x)
					that.playerPosition.position.x += 0.01;
				else
				{
					that.playerPosition.position = that.positionFinale;
					that.onRight = false;
				}
			}
		}
	});
}

Player.prototype.detectCollisions = function() 
{	
	var that = this;
	this.mesh.loadedMeshes.forEach(function(mesh) {
		for (var cptCaillou = 0; cptCaillou < that.game.obstacleManager.obstacles.length; cptCaillou++)
		{
			if (mesh.intersectsMesh(that.game.obstacleManager.obstacles[cptCaillou], false)) {
			 	that.game.obstacleManager.obstacles[cptCaillou].dispose();
			 	that.game.obstacleManager.obstacles.splice(cptCaillou,1);
			 	cptCaillou --;
			 	return;
			}
		}
	});
}
