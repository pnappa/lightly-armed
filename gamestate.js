
class GameState {
	constructor(canvas, context) {
		//TODO: update that the offsets get updated on resize... otherwise clicks don't work after
		this.canvas = canvas;
		this.ctx = context;
		this.leftOffset = canvas.offsetLeft;
		this.topOffset = canvas.offsetTop;
		this.screenState = null;
		this.elements = [];
        // stores the index that clickable objects reside in
        this.clickableReference = [];
        // stores the index that animated objects reside in
        this.animatedReference = [];
        
		// allow us to emulate mouse interactions
		this.canvas.addEventListener('click', (event) => {this.clickHandler(event); }, false);
		// document compared to canvas, as the canvas will not have focus, probably.
		// if we were to embed this in a scrollable, I suppose I should set tabindex, so make it focus, and instead use canvas
		document.addEventListener('keydown', (event) => {this.keyHandler(event); }, false);

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
        // TODO: clone by json.dumps & load
		this.elements = Scenes[menu];
        this.clickableReference = [];
        this.animatedReference = [];

        // sort by zlevel
        this.elements.sort(
            (a, b) => {
                let az = a["zlevel"];
                let bz = b["zlevel"];
                return ((az < bz) ? -1 : ((az > bz) ? 1 : 0));
            });

        // populate the clickable and animatedReference elements
        // these just indicate where to look in the element list
        this.elements.forEach(
            (el, index) => {
                if ("anim" in el) {
                    this.animatedReference.push(index);
                    // to allow easy referential deletion
                    el["index"] = index;
                }
                if ("onclick" in el) {
                    if (!("bounds" in el)) throw "clickable object without bounding box";
                    this.clickableReference.push(index);
                    // to allow easy referential deletion
                    el["index"] = index;
                }
            });
	}

	update(dt) {
		//if (dt >= 0.02) console.log(dt);
		// if (this.isFocused === true) {
		// 	// if we just focused this round, ignore it, as the delta will be off
		// 	if (this.beginFocus == true) {
		// 		this.beginFocus = false;
		// 		dt = 0.0;
		// 	} 
        
        // iterate over all animated objects and call their functions
        this.animatedReference.forEach(
            (ind) => {
                // don't animate dead objects
                if (ind === null) return;
                this.elements[ind]["anim"](this.elements[ind], dt, this);
            });
	}

	getDraws() {
		if (!this.screenState) throw "could not draw null scene";
		return this.elements;
	}

	// handle the clicks, and determine what needs to be done on click
	clickHandler(event) {

		var x = event.pageX - this.leftOffset;
		var y = event.pageY - this.topOffset;

        this.clickableReference.forEach(
            (ind) => {
                // ignore removed elements
                if (ind === null) return;
                let el = this.elements[ind];
                if (el === null) return;
                let bounds = el["bounds"];
                if (x >= bounds[0] && x <= bounds[0] + bounds[2] &&
                    y >= bounds[1] && y <= bounds[1] + bounds[3]) {
                    el["onclick"](el, this);
                }
            });

		////handle clicks if only there are elements that could
		//if ("clickable" in gs.elements) {
		//	gs.elements["clickable"].forEach((el) => {
		//		// call the function for the clickable object if within bounds
		//		if (x >= el["bounds"][0] && x <= el["bounds"][0] + el["bounds"][2] &&
        //            y >= el["bounds"][1] && y <= el["bounds"][1] + el["bounds"][3]) {

		//			el["onclick"](el, gs);
		//		}
		//	});
		//}

		// handle the clicks designed for game playing
		if (this.screenState["name"] === "gameplay") {
			//TODO: handle mouse clicks with respect to where they will be placed

            // lets just fire a line, 
		}
	}

    /* given this object, delete it from gs.elements */
    deleteObj(obj) {
        //throw "unimplemented function... haven't updated to the new render format";
        let ind = obj["index"];

        // search through the animated references and nullify them
        if ("anim" in obj) {
            this.animatedReference.forEach(
                (v, i) => {
                    if (v === ind) {
                        this.animatedReference[i] = null;
                    }
                });
        }
        // search through and remove from clickable
        if ("onclick" in obj) {
            this.clickableReference.forEach(
                (v, i) => {
                    if (v === ind) {
                        this.clickableReference[i] = null;
                    }
                });
        }

        this.elements[ind] = null;
    }

	/* handle keyboard events */
	keyHandler(event) {
		console.log(event);
	}
}