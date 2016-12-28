
var ctx = document.getElementById("game").getContext("2d");
var gameState = new GameState();
var renderer = new Renderer(ctx, gameState);

function init() {
	//TODO: more
	gameState.setScreen("main_menu");
}

// game loop
function main() {
	let now = Date.now();
	var dt = then-now;

	gameState.update(delta/1000);
	render();

	then = now;

	requestAnimationFrame(main);
}

var oldT = Date.now();
init();
main();