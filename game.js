/*
 *	Longterm TODO:
 *	- In the future, it may be better to flatten, and simply query the objects for anim/clickable
 *		This is because at the moment, it is not really that feasible to have a single object that is both animated and clickable
 *	- Tween scene changes - perhaps, cuts are not for everyone?
 *	
 */



var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
var gameState = new GameState(cvs, ctx);
var renderer = new Renderer(ctx, gameState);

function init() {
	//TODO: more
	gameState.setScreen("main_menu");
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