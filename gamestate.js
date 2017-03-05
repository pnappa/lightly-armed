
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
		// TODO: make sure that there is a field, "name": menu, where menu is the supplied arg

		// best to read from file i'd suppose, but maybe the file is loaded into scope on init()?

		//xxx: temp
		this.screenState = menu;
		this.elements = {
			"text": [
				{
					"zlevel": 100,
					"corn": "MAXIMUM"
				}
			],
			"clickable": [
				{
					"zlevel": 69,
					"corn": "MEGA"
				}
			]
		}
		
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
				console.log("CLICKO");
				console.log(el);
			});
		}

		// handle the clicks designed for game playing
		if (this.screenState["name"] === "gameplay") {
			//TODO: handle mouse clicks with respect to where they will be placed
		}
	}
}