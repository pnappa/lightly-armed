
class GameState {
	constructor(canvas, context) {
		//TODO:
		this.canvas = canvas;
		this.ctx = context;
		this.leftOffset = canvas.offsetLeft;
		this.topOffset = canvas.offsetTop;
		this.screenState = null;
		this.elements = {};
		// allow us to emulate mouse interactions
		this.canvas.addEventListener('click', (event) => {this.clickHandler(event, this); }, false);
	}

	setScreen(menu) {
		//TODO: create the elements and save to drawable elements
		// TODO: make sure that there is a field, "name": menu, where menu is the supplied arg

		// best to read from file i'd suppose, but maybe the file is loaded into scope on init()?

		//xxx: temp
		this.screenState = menu;
		this.ctx.font = "36px Arimo";
		this.elements = {
			"static": [
				// obscures red bars from view underneath title text
				{
					"zlevel": 40,
					"type": "shape",
					"shape": "rect",
					"pos": [0, 0],
					"width": 227,
					"height": 143,
					"colour": "white"
				},
				// gradient menu button
				{
					"zlevel": 40,
					"type": "shape",
					"shape": "rect",
					"pos": [331, 254],
					"width": 269,
					"height": 20,
					"colour": "rgb(14,117,16)"
				},
				{
					"zlevel": 40,
					"type": "shape",
					"shape": "rect",
					"pos": [291, 320],
					"width": 309,
					"height": 20,
					"colour": "rgb(205,8,20)"
				},
				// title text
				{
					"zlevel": 100,
					"type": "image",
					"src": RESOURCES["title_text"],
					"pos": [0, 0]
				},
				// button text
				{
					"type": "text",
					"zlevel": 100,
					"font-family": "Helvetica",
					"font-size": 33.3,
					"font-weight": "lighter",
					"value": "play game",
					"pos": [430, 238], 					
					"colour": "#000000",
				},
				{
					"type": "text",
					"zlevel": 100,
					"font-family": "Helvetica",
					"font-size": 33.3,
					"font-weight": "lighter",
					"value": "join game",
					"pos": [440, 306], 					
					"colour": "#000000",
				},
				{
					"type": "text",
					"zlevel": 100,
					"font-family": "Helvetica",
					"font-size": 33.3,
					"font-weight": "lighter",
					"value": "how to play",
					"pos": [416, 380], 					
					"colour": "#000000",
				}
			],
			"clickable": [
				//menu buttons
				{
					"zlevel": 30,
					"type": "shape",
					"shape": "rect",
					"pos": [331, 188],
					"width": 269,
					"height": 66,
					"colour": "rgb(46,160,203)",
					"bounds": [331, 188, 269, 66],
					"onclick": (obj, gs) => { console.log("playgame pressed"); }	
				},
				{
					"zlevel": 30,
					"type": "shape",
					"shape": "rect",
					"pos": [291, 254],
					"width": 309,
					"height": 66,
					"colour": "rgb(224,175,54)",
					"bounds": [281, 254, 319, 66],
					"onclick": (obj, gs) => { console.log("join room pressed"); }	
				},
				{
					"zlevel": 30,
					"type": "shape",
					"shape": "rect",
					"pos": [251, 320],
					"width": 349,
					"height": 83,
					"colour": "rgb(212,62,167)",
					"bounds": [251, 320, 349, 83],
					"onclick": (obj, gs) => { console.log("how to play pressed"); }	
				},
				

				// // random clickable
				// {
				// 	"zlevel": 69,
				// 	"type": "shape",
				// 	"shape": "rect",
				// 	"pos": [300, 20],
				// 	"width": 100,
				// 	"height": 100,
				// 	"colour": "red",
				// 	"bounds": [300, 20, 100, 100],
				// 	"onclick": (obj, gs) => { if (obj["colour"] === "red") { obj["colour"] = "blue"; } else { obj["colour"] = "red"; }}
				// }
			],
			"animation": [
				// LEFT COLUMN
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] -= 30*dt;
						if (obj["pos"][1] <= -240) {
							obj["pos"][1] = gs.canvas.height + 0;
						}
					},
					"pos": [39, 300],
					"width": 19,
					"height": 240
				},
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] -= 30*dt;
						if (obj["pos"][1] <= -160) {
							obj["pos"][1] = gs.canvas.height + 80;
						}
					},
					"pos": [39, 60],
					"width": 19,
					"height": 160
				},
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] -= 30*dt;
						if (obj["pos"][1] <= -80) {
							obj["pos"][1] = gs.canvas.height + 160;
						}
					},
					"pos": [39, -50],
					"width": 19,
					"height": 80
				},
				// MIDDLE COL
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] += 40*dt;
						if (obj["pos"][1] >=  gs.canvas.height) {
							obj["pos"][1] = -240;
						}
					},
					"pos": [79, 340],
					"width": 19,
					"height": 240
				},
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] += 40*dt;
						if (obj["pos"][1] >= gs.canvas.height+100) {
							obj["pos"][1] = -140;
						}
					},
					"pos": [79, 120],
					"width": 19,
					"height": 140
				},
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] += 40*dt;
						if (obj["pos"][1] >= gs.canvas.height+140) {
							obj["pos"][1] = -100;
						}
					},
					"pos": [79, -30],
					"width": 19,
					"height": 100
				},
				// RIGHT COL
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] -= 10*dt;
						if (obj["pos"][1] <= -240) {
							obj["pos"][1] = gs.canvas.height + 0;
						}
					},
					"pos": [119, 320],
					"width": 19,
					"height": 240
				},
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] -= 10*dt;
						if (obj["pos"][1] <= -160) {
							obj["pos"][1] = gs.canvas.height + 80;
						}
					},
					"pos": [119, 80],
					"width": 19,
					"height": 160
				},
				{
					"type": "shape",
					"zlevel": 30,
					"shape": "rect",
					"colour": 'rgb(205,8,20)',
					"anim": (obj,dt,gs) => {
						obj["pos"][1] -= 10*dt;
						if (obj["pos"][1] <= -80) {
							obj["pos"][1] = gs.canvas.height + 160;
						}
					},
					"pos": [119, -50],
					"width": 19,
					"height": 80
				},



				{
					"type": "text",
					"zlevel": 100,
					"font-family": "Arial",
					"font-size": 40,
					"value": "fuck",
					"pos": [400, 300], 					
					"colour": "#bad455",
					"anim": (obj, dt, gs) => {
						obj.pos[0] = (obj.pos[0] + dt * 80) % gs.canvas.width; 
						if (obj.pos[0] < -100) obj.pos[0] = 400;
						obj["font-size"] = ((obj["font-size"] + 1) % 60);
					}
				}
			]
		}
		
	}

	update(dt) {
		// iterate over all animated objects and call their functions
		this.elements["animation"].forEach((x) => {
			x["anim"](x, dt, this);
		});
	}

	getDraws() {
		if (!this.screenState) throw "could not draw null scene";
		return this.elements;
	}

	// handle the clicks, and determine what needs to be done on click
	clickHandler(event, gs) {

		var x = event.pageX - gs.leftOffset;
		var y = event.pageY - gs.topOffset;

		//handle clicks if only there are elements that could
		if ("clickable" in gs.elements) {
			gs.elements["clickable"].forEach((el) => {
				// call the function for the clickable object
				if (x >= el["bounds"][0] && x <= el["bounds"][0] + el["bounds"][2] && y >= el["bounds"][1] && y <= el["bounds"][1] + el["bounds"][3]) {
					el["onclick"](el, gs);
				}
			});
		}

		// handle the clicks designed for game playing
		if (gs.screenState["name"] === "gameplay") {
			//TODO: handle mouse clicks with respect to where they will be placed
		}
	}
}