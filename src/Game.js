function Game (canvas)
{
	this.canvas = canvas;
	this.engine = new BABYLON.Engine(this.canvas, true);
	this.scene = new BABYLON.Scene(this.engine);
	this.loader = new Loader(this);
	this.player = new Player(this);
	this.world = new World(this);
	this.obstacleManager = new ObstacleManager(this);
	this.collectibleManager = new CollectibleManager(this);
	this.speedParallax = 0.005;
   	this.cooldownObstacle = 2;
   	this.cooldownCollectible = 4.1;
}
Game.prototype.constructor = Game;

Game.prototype.init = function()
{
	this.scene.debugLayer.show();
	this.player.load();
	this.world.load();
	this.obstacleManager.load();
	this.collectibleManager.load();
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
		that.player.detectCollisions();
		that.world.animate();
	});

	this.engine.runRenderLoop(function () {
		that.scene.render();
	});
}
