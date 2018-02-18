/*
 *	Longterm TODO:
 *	- In the future, it may be better to flatten, and simply query the objects for anim/clickable
 *		This is because at the moment, it is not really that feasible to have a single object that is both animated and clickable
 *	- Tween scene changes - perhaps, cuts are not for everyone?
 *	- Add mousedown & mouseup events instead of just click, just to allow button press animations!	
 */


var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
var gameState = new GameState(cvs, ctx);
var renderer = new Renderer(ctx, gameState);
var oldTime = Date.now();


function update() {
	let now = Date.now();
	let dt = now - oldTime;

	gameState.update(dt/1000);

	oldTime = now;
}

function init() {
	ctx.imageSmoothingEnabled = false;
	gameState.setScreen("main_menu");
	// gameState.setScreen("game_menu");
	var oldTime = Date.now();
	setInterval(() => { update() }, 1000/60);
}

// game loop
function main() {
	renderer.render();
	requestAnimationFrame(main);
}
window.onload = () => { init(); main(); };