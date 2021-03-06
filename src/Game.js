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
	this.speedParallax = 0.05;
   	this.cooldownObstacle = 2;
   	this.cooldownCollectible = 4.1;
}
Game.prototype.constructor = Game;

Game.prototype.init = function()
{
	// this.scene.debugLayer.show();
	// Chargements spécifiques à chaque objet
	this.player.load();
	this.world.load();
	this.obstacleManager.load();
	this.collectibleManager.load();
	// Chargement global
	this.loader.loader.load();
}

Game.prototype.createScene = function()
{
	// Mise en place de la caméra, la lumière et la gravité
	this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 50, -100), this.scene);
	this.light = new BABYLON.HemisphericLight("mainLight", new BABYLON.Vector3(0,1,0), this.scene);
	this.camera.setTarget(new BABYLON.Vector3(0,0,-1));
	this.camera.attachControl(this.canvas, false);
	this.scene.enablePhysics();
	this.scene.setGravity(new BABYLON.Vector3(0, -10, 0));

	// Initialisation des objets
	this.player.init();
	this.world.init();
}

Game.prototype.loop = function ()
{
	var that = this;
	this.scene.registerBeforeRender(function(){
		that.player.move();					// Déplacement du player
		that.player.detectCollisions();		// Vérification des collisions
		that.world.animate();				// Défilement du monde
	});

	this.engine.runRenderLoop(function () {
		that.scene.render();
	});
}

Game.prototype.defeat = function ()
{
	// Suppression du jeu 
	this.scene.dispose();
	this.engine.dispose();
	// Affichage de l'écran de fin
	$("#ingame").css("display","none");
	$("#menu").css("display","block");
	$("#menu > div").css("display","none");
	$("#endingScreen").css("display","block");
}


