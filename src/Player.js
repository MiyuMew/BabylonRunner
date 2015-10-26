function Player (game)
{
	this.game = game;
	this.mesh;
	this.playerPosition = new BABYLON.Mesh("playerPosition",this.game.scene);
	this.onLeft = false;
	this.onRight = false;
	this.nbVies = 3;
	this.nbPiecesCollectees = 0;
	this.positionFinale = BABYLON.Vector3.Zero();
}
Player.prototype.constructor = Player;

Player.prototype.load = function ()
{
	var that = this;

	// Ajout au loader du ninja
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

	// Initialisation du HUD
	$("#nbVies").text(this.nbVies);
	$(".nbCoins").text(this.nbPiecesCollectees);

	// Initialisation de la position et de l'orientation du ninja
	this.playerPosition.rotation.x = -Math.PI/2;
	this.playerPosition.rotation.y = Math.PI;
	this.playerPosition.position.z = -40;

	// Création d'une animation de jump (sur le mouvement) en plus de l'animation graphique
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

	// En fonction des touches, diverses actions
	window.addEventListener('keyup',function(event){
		if (event.keyCode == 90) // jump
		{
			// Lancement de l'animation graphique
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 241, 276, false, 1.5, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
	 		// Lancement de l'animation de mouvement
	 		that.game.scene.beginDirectAnimation(that.playerPosition, [animationBoxJump], 0,10,false,1);
		}
		else if (event.keyCode == 81) // left
		{
			// On définit la position finale que doit avoir le player
			that.onLeft = true;
			that.positionFinale = that.playerPosition.position.add(new BABYLON.Vector3(-10,0,0));
			// Lancement de l'animation graphique
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 178, 208, false, 2, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
		}
		else if (event.keyCode == 68) // right
		{
			// On définit la position finale que doit avoir le player
			that.onRight = true;
			that.positionFinale = that.playerPosition.position.add(new BABYLON.Vector3(10,0,0));
			// Lancement de l'animation graphique
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 209, 240, false, 1, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
		}
		else if (event.keyCode == 83) // slide
		{
			// Lancement de l'animation graphique
			that.mesh.loadedSkeletons.forEach(function(s) {
				that.game.scene.beginAnimation(s, 277, 307, false, 1, function(){ that.game.scene.beginAnimation(s, 86, 106, true); });
	 		});
		}
	});

	// On lance la boucle de jeu
	this.game.loop();
}

Player.prototype.move = function()
{
	var that = this;
	// On bouge le player vers sa position finale
	this.game.scene.registerBeforeRender(function(){
		if (that.positionFinale.x >= -10 && that.positionFinale.x <= 10)
		{
			if (that.onLeft)
			{
				if (that.playerPosition.position.x > that.positionFinale.x)
					that.playerPosition.position.x -= 0.01;
				else
				{
					// Quand la position finale est atteinte on la lui attribut pour éviter tout soucis 
					// et on indique que son déplacement est fini
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
					// Quand la position finale est atteinte on la lui attribut pour éviter tout soucis 
					// et on indique que son déplacement est fini
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

	// Pour chacun des mesh du player
	this.mesh.loadedMeshes.forEach(function(mesh) {
		// On test sa collision avec les rochers du jeu
		for (var cptCaillou = 0; cptCaillou < that.game.obstacleManager.obstacles.length; cptCaillou++)
		{
			// Si il y a collision on retire une vie et on fait trembler le canvas
			if (mesh.intersectsMesh(that.game.obstacleManager.obstacles[cptCaillou], false)) {
			 	that.game.obstacleManager.obstacles[cptCaillou].dispose();
			 	that.game.obstacleManager.obstacles.splice(cptCaillou,1);
			 	if (that.nbVies > 0)
			 		that.nbVies --;
			 	else
			 		that.game.defeat();	// Si c'était sa dernière vie on met en place la défaite
			 	$("#nbVies").text(that.nbVies);	// Mise a jour du HUD
			 	cptCaillou --;
			 	shakeScreen();
			 	return;
			}
		}

		// On test sa collision avec les coins du jeu
		for (var cptCollectible = 0; cptCollectible < that.game.collectibleManager.collectibles.length; cptCollectible++)
		{
			// Si il y a collision on augmente le nombre de coins récoltés de 1
			if (mesh.intersectsMesh(that.game.collectibleManager.collectibles[cptCollectible], false)) {
			 	that.game.collectibleManager.collectibles[cptCollectible].dispose();
			 	that.game.collectibleManager.collectibles.splice(cptCollectible,1);
			 	that.nbPiecesCollectees ++;
			 	$(".nbCoins").text(that.nbPiecesCollectees);	// Mise a jour du HUD
			 	cptCollectible --;
			 	return;
			}
		}
	});
}
