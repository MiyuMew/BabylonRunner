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
World.prototype.init = function ()
{
    for(var i = 0; i <= 10; i++)
    {
        var fond = new BABYLON.Mesh.CreatePlane("fond", 10, this.game.scene);
        fond.material = this.materialFond;
        fond.material.diffuseTexture = this.textureFond;
        if (i >= 5)
        {
        	fond.position.x = -4;
        	fond.position.z = 2 + 10*(i-5);
       		fond.rotate(BABYLON.Axis.Y, -3*Math.PI/7, BABYLON.Space.WORLD);
        	fond.rotate(BABYLON.Axis.Z, Math.PI/6, BABYLON.Space.WORLD);
    	}
    	else
    	{
    		fond.position.x = 4;
    		fond.position.z = 2 + 10*i;
        	fond.rotate(BABYLON.Axis.Y, 3*Math.PI/7, BABYLON.Space.WORLD);
        	fond.rotate(BABYLON.Axis.Z, -Math.PI/6, BABYLON.Space.WORLD);
        }
        this.fonds.push(fond);
    }

    for (var i = 0; i <= 15; i++) 
    {
        var plane = new BABYLON.Mesh.CreatePlane("plane1", 4, this.game.scene);
        plane.material = this.materialPlane;
        plane.material.diffuseTexture = this.textureGround;
        plane.rotate(BABYLON.Axis.X, Math.PI/2);
        plane.position.z = i*4;
        this.planes.push(plane);

        var bordG = new BABYLON.Mesh.CreateBox("bordG", 1, this.game.scene);
        bordG.material = this.materialBord;
        bordG.material.diffuseTexture = this.textureRock;
        bordG.position.x = -2;
        bordG.scaling.x = 5;
        bordG.scaling.z = 20;
        bordG.position.z = i*4;
        this.wallsG.push(bordG);

        var bordD = new BABYLON.Mesh.CreateBox("bordD", 1, this.game.scene);
        bordD.material = this.materialBord;
        bordD.material.diffuseTexture = this.textureRock;
        bordD.position.x = 2;
        bordD.scaling.x = 5;
        bordD.scaling.z = 20;
        bordD.position.z = i*4;
        this.wallsD.push(bordD);
    };
}

World.prototype.animate = function ()
{
	for(var i = 0; i < this.planes.length; i++)
    {
        this.planes[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime();
        this.wallsG[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime();
        this.wallsD[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime();

        if(this.planes[i].position.z < -8)
        {
            this.planes[i].position.z = 49;
            this.wallsG[i].position.z = 49;
            this.wallsD[i].position.z = 49;
        }
    }

    for(var i = 0; i < this.fonds.length; i++)
    {
        this.fonds[i].position.z -= this.game.speedParallax/2 * this.game.engine.getDeltaTime();

        if(this.fonds[i].position.z < -15)
            this.fonds[i].position.z = 45;
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