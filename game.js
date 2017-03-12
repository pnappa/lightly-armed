var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
var gameState = new GameState(cvs, ctx);
var renderer = new Renderer(ctx, gameState);

function init() {
	//TODO: more
	gameState.setScreen("main_menu");
	// ctx.translate(0.5, 0.5)
	// ctx.imageSmoothingEnabled = true;
}

// game loop
function main() {
	let now = Date.now();
	var dt = now - oldTime;

	gameState.update(dt/1000);
	renderer.render();

	oldTime = now;

	requestAnimationFrame(main);
}

var oldTime = Date.now();
window.onload = () => { init(); main(); };