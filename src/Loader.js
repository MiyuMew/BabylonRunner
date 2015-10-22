function Loader (game)
{
	var that = this;
	this.game = game;
	this.loader = new BABYLON.AssetsManager(this.game.scene);

	this.loader.onFinish = function (tasks) {
		that.game.createScene();
	}
}
Loader.prototype.constructor = Loader;
Loader.prototype.add = function (type,libelle,chemin,nomFichier,callback)
{
	var objet;
	switch (type)
	{
		case "mesh" : objet = this.loader.addMeshTask(libelle, "", chemin, nomFichier);
		break;
		case "texture" : objet = this.loader.addTextureTask(libelle, chemin+nomFichier);
		break;
	}
	objet.onSuccess = callback;
}