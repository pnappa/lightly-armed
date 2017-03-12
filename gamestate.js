
class GameState {
	constructor(canvas) {
		//TODO:
		this.canvas = canvas;
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
		this.elements = {
			"static": [
				{
					"type": "text",
					"zlevel": 99,
					"font-family": "Helvetica",
					"font-size": 36,
					"value": "fuck",
					"pos": [50, 50], 					
					"colour": "#000000",
				}

			],
			"clickable": [
				{
					"zlevel": 69,
					"type": "shape",
					"shape": "rect",
					"bounds": [0, 0, 100, 100],
					"pos": [0, 0],
					"width": 100,
					"height": 100,
					"colour": "red",
					"onclick": console.log
				}
			],
			"animation": [
				{
					"type": "text",
					"zlevel": 100,
					"font-family": "Arial",
					"font-size": 40,
					"value": "fuck",
					"pos": [400, 300], 					
					"colour": "#bad455",
					"anim": (obj, dt, cvs) => {
						obj.pos[0] = (obj.pos[0] + dt * 80) % cvs.width; 
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
			x["anim"](x, dt, this.canvas);
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
				// TODO: we should determine what the contents should be first
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