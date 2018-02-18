
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
		// document compared to canvas, as the canvas will not have focus, probably.
		// if we were to embed this in a scrollable, I suppose I should set tabindex, so make it focus, and instead use canvas
		document.addEventListener('keydown', (event) => {this.keyHandler(event, this); }, false);

		// // animations mess up on tab changes, so it's better to leave it
		// this.isFocused = true;
		// // if during this frame we focus
		// this.beginFocus = true;
		// window.addEventListener('focus', (event) => { this.makeFocus(event, this); }, false);
		// window.addEventListener('blur', (event) => { this.stopFocus(event, this); }, false);
	}

	makeFocus(event, gs) {
		// console.log("focusing");
		// gs.isFocused = true;
		// gs.beginFocus = true;
	}

	stopFocus(event, gs) {
		// console.log("unfocusing");
		// gs.isFocused = false;
		// gs.beginFocus = false;
	}

	/* set the elements that should be drawn for this menu */
	setScreen(menu) {
		this.screenState = menu;
		this.elements = Scenes[menu];
	}

	update(dt) {
		if (dt >= 0.02) console.log(dt);
		// if (this.isFocused === true) {
		// 	// if we just focused this round, ignore it, as the delta will be off
		// 	if (this.beginFocus == true) {
		// 		this.beginFocus = false;
		// 		dt = 0.0;
		// 	} 

			// iterate over all animated objects and call their functions
			this.elements["animation"].forEach((x) => {
				x["anim"](x, dt, this);
			});	
		// }
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

	/* handle keyboard events */
	keyHandler(event, gs) {
		console.log(event);
	}
}