function ObstacleManager(game)
{
	this.game = game;
	this.mesh;
	this.materialObstacle;
	this.textureObstacle;
	this.obstacles = [];
}

ObstacleManager.prototype.constructor = ObstacleManager;
ObstacleManager.prototype.load = function()
{
	var that = this;

	this.game.loader.add("mesh", "obstacles", "./assets/world/", "rockObstacle.babylon", function(task){
		that.mesh  = task;
	});

	this.game.loader.add("texture", "obstacles", "./assets/world/", "kudaki_iwa.png", function(task){
		that.textureObstacle = task.texture;
	});
}
ObstacleManager.prototype.createObstacle = function(posX)
{
	var obstacle = this.mesh.clone("obstacle");
	obstacle.position = new BABYLON.Vector3(posX, 0, 40);
	obstacle.material = this.materialObstacle;
	obstacle.material.diffuseTexture = this.textureObstacle;

	this.obstacles.push(obstacle);
}
ObstacleManager.prototype.move = function(scene, engine)
{
	this.obstacles.forEach(function(obstacle){
		obstacle.position.z -= 0.005 * engine.getDeltaTime();
	})
	//console.log(this.obstacle.position.z);
}