function Game (canvas)
{
	this.canvas = canvas;
	this.engine = new BABYLON.Engine(this.canvas, true);
	this.scene = new BABYLON.Scene(this.engine);
	this.loader = new Loader(this);
	this.player = new Player(this);
	this.world = new World(this);
	this.speedParallax = 0.005;
   	this.cooldownObstacle = 2;
}
Game.prototype.constructor = Game;
Game.prototype.init = function()
{
	var that = this;
	this.scene.debugLayer.show();
	this.loader.add("mesh","player","./assets/player/", "ninja.babylon", function(task){
		that.player.mesh = task.loadedSkeletons;
		task.loadedMeshes.forEach(function(mesh) {
			mesh.parent = that.player.playerPosition;
		});

 		that.player.mesh.forEach(function(s) {
			that.scene.beginAnimation(s, 86, 106, true, 1);
 		});
	});

	this.loader.add("texture","fond","./assets/world/", "rocks.png", function(task){
		that.world.textureFond = task.texture;
	});

	this.loader.add("texture","ground","./assets/world/", "Grass.png", function(task){
		that.world.textureGround = task.texture;
	});

	this.loader.add("texture","rock","./assets/world/", "rockWall.png", function(task){
		that.world.textureRock = task.texture;
	});

	this.loader.loader.load();
}

Game.prototype.createScene = function()
{
	this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 50, -100), this.scene);
	this.light = new BABYLON.HemisphericLight("mainLight", new BABYLON.Vector3(0,1,0), this.scene);
	this.camera.setTarget(new BABYLON.Vector3(0,0,-1));
	this.camera.attachControl(this.canvas, false);
	this.scene.enablePhysics();
	this.scene.setGravity(new BABYLON.Vector3(0, -10, 0));

	this.player.init();
	this.world.init();
}

Game.prototype.loop = function ()
{
	var that = this;
	this.scene.registerBeforeRender(function(){
		that.player.move();
		that.world.animate();
	});

	this.engine.runRenderLoop(function () {
		that.scene.render();
	});
}
