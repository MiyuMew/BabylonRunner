function World (game)
{
	this.game = game;
	this.planes = [];
    this.wallsG = [];
    this.wallsD = [];
   	this.fonds = [];
   	this.obstacles = [];
   	this.animations = [];
 
   	this.materialFond = new BABYLON.StandardMaterial("fond", this.game.scene);
    this.materialPlane = new BABYLON.StandardMaterial("ground", this.game.scene);
    this.materialBord = new BABYLON.StandardMaterial("bord", this.game.scene);

    this.textureFond;
    this.textureGround;
    this.textureRock;
}
World.prototype.constructor = World;

World.prototype.load = function () 
{
    var that = this;
    this.game.loader.add("texture","fond","./assets/world/", "rocks.png", function(task){
        that.textureFond = task.texture;
    });

    this.game.loader.add("texture","ground","./assets/world/", "Grass.png", function(task){
        that.textureGround = task.texture;
    });

    this.game.loader.add("texture","rock","./assets/world/", "rockWall.png", function(task){
        that.textureRock = task.texture;
    });
}

World.prototype.init = function ()
{
    for(var i = 0; i <= 10; i++)
    {
        var fond = new BABYLON.Mesh.CreatePlane("fond", 100, this.game.scene);
        fond.material = this.materialFond;
        fond.material.diffuseTexture = this.textureFond;
        if (i >= 5)
        {
        	fond.position.x = -40;
        	fond.position.z = (2 + 10*(i-5))*10;
       		fond.rotate(BABYLON.Axis.Y, -3*Math.PI/7, BABYLON.Space.WORLD);
        	fond.rotate(BABYLON.Axis.Z, Math.PI/6, BABYLON.Space.WORLD);
    	}
    	else
    	{
    		fond.position.x = 40;
    		fond.position.z = (2 + 10*i)*10;
        	fond.rotate(BABYLON.Axis.Y, 3*Math.PI/7, BABYLON.Space.WORLD);
        	fond.rotate(BABYLON.Axis.Z, -Math.PI/6, BABYLON.Space.WORLD);
        }
        this.fonds.push(fond);
    }

    for (var i = 0; i <= 15; i++) 
    {
        var plane = new BABYLON.Mesh.CreatePlane("plane1", 40, this.game.scene);
        plane.material = this.materialPlane;
        plane.material.diffuseTexture = this.textureGround;
        plane.rotate(BABYLON.Axis.X, Math.PI/2);
        plane.position.z = i*40;
        this.planes.push(plane);

        var bordG = new BABYLON.Mesh.CreateBox("bordG", 1, this.game.scene);
        bordG.material = this.materialBord;
        bordG.material.diffuseTexture = this.textureRock;
        bordG.position.x = -20;
        bordG.scaling = new BABYLON.Vector3(5,10,20);
        bordG.position.z = i*40;
        this.wallsG.push(bordG);

        var bordD = new BABYLON.Mesh.CreateBox("bordD", 1, this.game.scene);
        bordD.material = this.materialBord;
        bordD.material.diffuseTexture = this.textureRock;
        bordD.position.x = 20;
        bordD.scaling = new BABYLON.Vector3(5,10,20);
        bordD.position.z = i*40;
        this.wallsD.push(bordD);
    };
}

World.prototype.animate = function ()
{
	for(var i = 0; i < this.planes.length; i++)
    {
        this.planes[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime() * 10;
        this.wallsG[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime() * 10;
        this.wallsD[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime() * 10;

        if(this.planes[i].position.z < -80)
        {
            this.planes[i].position.z = 490;
            this.wallsG[i].position.z = 490;
            this.wallsD[i].position.z = 490;
        }
    }

    for(var i = 0; i < this.fonds.length; i++)
    {
        this.fonds[i].position.z -= (this.game.speedParallax/2 * this.game.engine.getDeltaTime())*10;

        if(this.fonds[i].position.z < -150)
            this.fonds[i].position.z = 450;
    }

    if(this.game.cooldownObstacle > 0)
        this.game.cooldownObstacle -= this.game.engine.getDeltaTime() * 0.001;
    else
    {
       // var obstacle = new Obstacles(scene, 0);
       // obstacles.push(obstacle);
       this.game.cooldownObstacle = 2;
    }

    for(var i = 0; i < this.obstacles.length; i++)
    {
        // this.obstacles[i].move(scene, engine);
    }
}