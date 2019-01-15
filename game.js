/*
 *	Longterm TODO:
 *	- Tween scene changes - perhaps, cuts are not for everyone?
 *	- Add mousedown & mouseup events instead of just click, just to allow button press animations!	
 *	- The bounds is very easy to fuck-up (x,y,w,h) - if we change the size, we need to change two vars..? however,
 *	    this does allow larger clickboxes that would be allowed if we use w & y from the width and height vars
 *	    i have mediated this slightly, by making that if the bounds is omitted, (x,y,w,h) is used as a bounding box)
 *	- Fix performance?? Some reason fires a lot of CPU. Am I doing it wrong? (wrt CPU: people on irc report otherwise..)
 *	    - death by a thousand cuts - convert the string comparison to defines (i.e. define scenes by constants/enums)
 *	    - fix the _draw fn such that it doesn't abuse ctx.save and ctx.restore 
 *	        - this was previously used to allow rotation.. but there is a better way. refer to player.js
 *
 * Bugs:
 *  - Dashing over extends past click point. Somehow calculate the required vel to not overextend
 *
 * Next:
 *  - Make collision detection interpolate, and not prevent movement
 *	- Implement cooldowns
 *	    - dashing
 *	    - firing laser
 *	- Implement powerups
 *	    - projectiles? like a rocket launcher
 *	    - speed up
 *	    - longer dash
 *	    - temporary shield
 *	    - extra life
 *	- Implement level dangers
 *	    - predfined moving lasers
 *	- Do level maps that contain walls, powerup spawns etc
 *	- Write the server to relay player positional data
 *	    - Server should simulate game
 *	    - Maybe not, its a lot of effort - let's just trust the players?
 */


var cvs = document.getElementById("game");
// prevent right click menu coming up in the canvas
cvs.oncontextmenu = (e) => { e.preventDefault(); }
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
	ctx.imageSmoothingEnabled = true;
    //gameState.setScreen("main_menu");
    // XXX: temporary, speed up testing game mode
	gameState.setScreen("gameplay");
	var oldTime = Date.now();
}

// game loop
function main() {
	renderer.render();
    update();
	requestAnimationFrame(main);
}
window.onload = () => { init(); main(); };
