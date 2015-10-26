function ObstacleManager(game)
{
	this.game = game;
	this.intervalle = 0;
	this.materialObstacle = new BABYLON.StandardMaterial("Obstacle", this.game.scene);;
	this.obstacles = [];
	this.mesh = null;
	this.obstacleRef = new BABYLON.Mesh("obstacleRef", this.game.scene);
}

ObstacleManager.prototype.constructor = ObstacleManager;
ObstacleManager.prototype.load = function()
{
	var that = this;

	this.game.loader.add("mesh", "obstacles", "./assets/world/", "rockObstacle.babylon", function(task){
		task.loadedMeshes[0].parent = that.obstacleRef;
		that.mesh = task.loadedMeshes[0];
		that.mesh.material = that.materialObstacle;
		that.mesh.material.diffuseTexture = new BABYLON.Texture("./assets/world/kudaki_iwa.png", that.game.scene);

		that.obstacleRef.scaling = new BABYLON.Vector3(15,15,15);
		that.obstacleRef.setEnabled(false);
	});
}
ObstacleManager.prototype.createObstacle = function(posX)
{
	var obstacle = this.obstacleRef.clone("obstacle");
	obstacle.position = new BABYLON.Vector3(posX, 0, 650);

	this.obstacles.push(obstacle);
}
ObstacleManager.prototype.move = function(game)
{
	var that = this;
	this.obstacles.forEach(function(obstacle){
		obstacle.position.z -= that.game.speedParallax * that.game.engine.getDeltaTime();
	});
}