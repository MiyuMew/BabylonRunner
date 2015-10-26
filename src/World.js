function World (game)
{
	this.game = game;
	this.planes = [];
    this.wallsG = [];
    this.wallsD = [];
   	this.fonds = [];
 
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

    // Ajout au loader de la texture du sol, des murs, et des bordures
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
    // Mise en place du terrain de facon a remplir l'espace
    for(var i = 0; i <= 16; i++)
    {
        var fond = new BABYLON.Mesh.CreatePlane("fond", 100, this.game.scene);
        fond.material = this.materialFond;
        fond.material.diffuseTexture = this.textureFond;
        if (i >= 8)
        {
        	fond.position.x = -40;
        	fond.position.z = (2 + 10*(i-8))*10;
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

    for (var i = 0; i <= 20; i++) 
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
    // Mise en place du parallax du monde, des coins et des rochers
    if(this.game.speedParallax < 0.2)
        this.game.speedParallax += 0.00002;

    if(this.game.obstacleManager.intervalle < 1.7)
        this.game.obstacleManager.intervalle += 0.00023;

    if(this.game.collectibleManager.intervalle < 5)
        this.game.collectibleManager.intervalle += 0.00067; 

	for(var i = 0; i < this.planes.length; i++)
    {
        this.planes[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime();
        this.wallsG[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime();
        this.wallsD[i].position.z -= this.game.speedParallax * this.game.engine.getDeltaTime();

        // Si des parties du sol ne sont plus visibles, on les remet à la fin afin d'éviter la création de nouveaux sols
        if(this.planes[i].position.z < -80)
        {
            var newPosition = this.planes[this.planes.length-1].position.z + 40;
            this.planes[i].position.z = newPosition;
            this.wallsG[i].position.z = newPosition;
            this.wallsD[i].position.z = newPosition;
            this.planes.push(this.planes[i]);
            this.wallsG.push(this.wallsG[i]);
            this.wallsD.push(this.wallsD[i]);
            this.planes.splice(i,1);
            this.wallsG.splice(i,1);
            this.wallsD.splice(i,1);
        }
    }

    // Si des parties du fond ne sont plus visibles, on les remet à la fin afin d'éviter la création de nouveaux fonds
    for(var i = 0; i < this.fonds.length; i++)
    {
        this.fonds[i].position.z -= (this.game.speedParallax/2 * this.game.engine.getDeltaTime());

        if(this.fonds[i].position.z < -150)
            this.fonds[i].position.z = 650;
    }      

    // Si il est temps de poser des obstacles on en crée
    if(this.game.cooldownObstacle <= 0)
    {
        var aleaNb = Math.floor(Math.random()+2);
        for(var i = 0; i < aleaNb; i++)
        {
            var alea = 10*(Math.floor(Math.random() * 3) - 1);
            this.game.obstacleManager.createObstacle(alea);
        }
        this.game.cooldownObstacle = 2 - this.game.obstacleManager.intervalle;
    }
    else if (this.game.cooldownCollectible <= 0)    // Sinon si il est temps de créer des coins on en crée
    {
        var alea = 10*(Math.floor(Math.random() * 3) - 1);
        this.game.collectibleManager.createCollectible(alea);
        this.game.cooldownCollectible = 10 - this.game.collectibleManager.intervalle;
    }  

    // On met à jour les compteurs de cooldown
    this.game.cooldownCollectible -= this.game.engine.getDeltaTime() * 0.001;
    this.game.cooldownObstacle -= this.game.engine.getDeltaTime() * 0.001;

    // On fait défiler les obstacles et les coins afin qu'ils suivent le mouvement de parallax
    this.game.obstacleManager.move(game);
    this.game.collectibleManager.move(game);
}