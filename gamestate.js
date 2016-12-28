
class GameState {
	constructor(canvas) {
		//TODO:
		this.canvas = canvas;
		this.leftOffset = canvas.offsetLeft;
		this.topOffset = canvas.offsetTop;
		this.screenState = null;
		// allow us to emulate mouse interactions
		this.canvas.addEventListener('click', this.clickHandler, false);
		this.elements = {};
	}

	setScreen(menu) {
		//TODO: create the elements and save to drawable elements
	}

	update(dt) {
		//TODO: based on the menu, do things

		// main_menu (red bar animations)
		// game_screen (duh)
		// waiting_screen (loading indicator sort of deal)
	}

	getDraws() {
		if (!this.screenState) throw "could not draw null scene";
		return this.elements;
	}

	// handle the clicks, and determine what needs to be done on click
	clickHandler(event) {

		var x = event.pageX - this.leftOffset;
		var y = event.pageY - this.topOffset;

		//handle clicks if only there are elements that could
		if ("clickable" in this.elements) {
			this.elements["clickable"].forEach((el) => {
				// TODO: we should determine what the contents should be first
			});
		}

		//TODO: allow gameplay mouse clicks
	}
}