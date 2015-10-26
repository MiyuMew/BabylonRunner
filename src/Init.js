$(document).ready(function() {
	$(".btnPlay").on("click", function () {
		$("#menu").css("display","none");
		$("#ingame").css("display","block");
		var game = new Game(document.getElementById("renderCanvas"));
		game.init();
	});
	$(".btnRules").on("click", function () {
		$("#menu > div").css("display","none");
		$("#rulesScreen").css("display","block");
	});
	$(".btnCredits").on("click", function () {
		$("#menu > div").css("display","none");
		$("#creditsScreen").css("display","block");
	});
	$(".btnMenu").on("click", function () {
		$("#menu > div").css("display","none");
		$("#homeScreen").css("display","block");
	});
});