var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
var gameState = new GameState(cvs);
var renderer = new Renderer(ctx, gameState);

function init() {
	//TODO: more
	gameState.setScreen("main_menu");
}

// game loop
function main() {
	let now = Date.now();
	var dt = oldTime - now;

	gameState.update(dt/1000);
	renderer.render();

	oldTime = now;

	requestAnimationFrame(main);
}

var oldTime = Date.now();
init();
main();