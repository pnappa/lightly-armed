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
 *  - Make laser continue until a blocking object, not just until the mouse
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
 *	    - Condense map mesh s.t. connecting walls will be made into a single shape
 *	        - this reduces collision detection cost
 *	- Write the server to relay player positional data
 *	    - Server should simulate game
 *	    - Maybe not, its a lot of effort - let's just trust the players?
 *	    - seeing as we're trusting, why not WebRTC?
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

// populate the Maps with walls, etc based on the map files
function loadMaps() {
    // just a basic bitch wall object
    const wallWidth = 30;
    const wallHeight = 30;
    const startX = 0;
    // maps start from y = 30, as the menu bar occupies the top 30 pixels
    const startY = 30;

    // TODO: move into separate file..?
    const Tiles = {
        '1': {
            "type": "shape",
            "shape": "rect",
            "zlevel": 70,
            "pos": [null, null],
            "width": wallWidth,
            "height": wallHeight,
            "colour": "green",
            "oncollide": () => {}
        }
    }

    function generateMap(fileName) {
        function parseMap(mapText) {
            let builtMap = [];
            let rows = mapText.trim().split('\n');
            console.log(rows);
            rows.forEach((row, rowNum) => {
                row.split(',').forEach((col, colNum) => {
                    // is there an object for this kind of tile?
                    if (col in Tiles) {
                        // shallow copy wall
                        let cWall = Object.assign({}, Tiles[col]);
                        cWall.pos = [colNum*wallWidth, startY + rowNum*wallHeight];
                        // XXX: temp assign random colour to walls
                        cWall.colour = colToRgbaStr([Math.random()*255, Math.random()*255, Math.random()*255, 1]);
                        builtMap.push(cWall);
                    }
                });
            });
            return builtMap;
        }

        var file = new XMLHttpRequest();
        file.open("GET", fileName, false);
        file.send();
        return parseMap(file.responseText);
    };

    for (let mapName in MapFiles) {
        Maps[mapName] = generateMap(MapFiles[mapName]);
    }

    console.log('loaded maps:', Maps);
}

function init() {
	ctx.imageSmoothingEnabled = true;
    loadMaps();
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
