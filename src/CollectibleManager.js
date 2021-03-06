function CollectibleManager(game)
{
	this.game = game;
	this.intervalle = 0;
	this.materialCollectible = new BABYLON.StandardMaterial("Collectible", this.game.scene);;
	this.collectibles = [];
	this.mesh = null;
	this.collectibleRef = new BABYLON.Mesh("collectibleRef", this.game.scene);
	this.coinsCreating = false;
}

CollectibleManager.prototype.constructor = CollectibleManager;
CollectibleManager.prototype.load = function()
{
	var that = this;

	// Ajout au loader du coin
	this.game.loader.add("mesh", "collectibles", "./assets/world/", "coin.babylon", function(task){
		task.loadedMeshes[0].parent = that.collectibleRef;
		that.mesh = task.loadedMeshes[0];
		that.mesh.material = that.materialCollectible;
		that.mesh.material.diffuseTexture = new BABYLON.Texture("./assets/world/coin.png", that.game.scene);

		that.collectibleRef.scaling = new BABYLON.Vector3(0.3,0.3,0.3);
		that.collectibleRef.setEnabled(false);	// Cache l'élément
	});
}
CollectibleManager.prototype.createCollectible = function(posX)
{
	// Création de 6 coins
	for(var i = 0; i < 6; i++)
	{
		var collectible = this.collectibleRef.clone("collectible");
		collectible.position = new BABYLON.Vector3(posX, 0, 650 + i * 25);
		this.collectibles.push(collectible);
	}

	this.coinsCreating = false;
}
CollectibleManager.prototype.move = function(game)
{
	// Défilement des coins 
	var that = this;
	this.collectibles.forEach(function(collectible){
		collectible.position.z -= that.game.speedParallax * that.game.engine.getDeltaTime();
	});
}