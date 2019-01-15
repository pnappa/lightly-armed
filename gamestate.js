
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

        this.player = new Player(50, 50, this);


        // because events are dumb, we store the event keypress in an array
        // and query this per update frame
        this.keys = [];
        // cache mouse pos, such that on character movement, we still have them pointing to the mouse
        this.mousePos = null;
        
		// allow us to emulate mouse interactions
		this.canvas.addEventListener('mousedown', (event) => {this.clickHandler(event); }, false);
		// document compared to canvas, as the canvas will not have focus, probably.
		// if we were to embed this in a scrollable, I suppose I should set tabindex, so make it focus, and instead use canvas
		document.addEventListener('keydown', (event) => { this.keys[event.keyCode] = true; }, false);
		document.addEventListener('keyup', (event) => {this.keys[event.keyCode] = false; }, false);
        // bug where if lost focus, character kept moving
        document.addEventListener('blur', (event) => {this.keys.forEach((_, index) => { this.keys[index] = false; });});

        canvas.addEventListener('mousemove', (event) => {this.mouseMoveHandler(event); }, false);


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
        this.clickableReference = [];
        this.animatedReference = [];
        this.collidableReference = [];
        
        // TODO: replace with a better way of injecting elements
        if (this.screenState === "gameplay") {
            this.elements.push(this.player);
        }

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
                // to allow easy referential deletion
                el["index"] = index;

                if ("anim" in el) {
                    this.animatedReference.push(index);
                }

                if ("onclick" in el) {
                    //if (!("bounds" in el)) throw "clickable object without bounding box";
                    this.clickableReference.push(index);
                }

                if (el["oncollide"]) {
                    this.collidableReference.push(index);
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

        if (this.screenState === "gameplay" && this.player != null) {
            // TODO: make this such that the most recent key overrides the opposite
            // s.t. if w is pressed, then s is pressed, we should move down, not stay still
            // w
            if (this.keys[87]) this.player.playerAddVel(0, -CHAR_SPEED); 
            // a 
            if (this.keys[65]) this.player.playerAddVel(-CHAR_SPEED, 0);
            // s
            if (this.keys[83]) this.player.playerAddVel(0, CHAR_SPEED); 
            // d
            if (this.keys[68]) this.player.playerAddVel(CHAR_SPEED, 0); 

            // update character to look at the last-known position of the mouse cursor
            if (this.mousePos != null) this.player.lookTowards(this.mousePos.x, this.mousePos.y);

            this.player.update(dt);
        }

        
	}

	getDraws() {
		if (!this.screenState) throw "could not draw null scene";
		return this.elements;
	}

    mouseMoveHandler(event) {
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        this.mousePos = getMousePos(this.canvas, event);
    }

	// handle the clicks, and determine what needs to be done on click
	clickHandler(event) {

		var x = event.pageX - this.leftOffset;
		var y = event.pageY - this.topOffset;

        // TODO: cleanup, use a design pattern here imo
        const lmb = 0;
        const rmb = 2;
        let isLeftClick = event.button === lmb;
        let isRightClick = event.button === rmb;

        if (isLeftClick) {
            // XXX: i moved this up here because if we moved towards the gameplay, it meant that
            // we fired a laser. moving it up here is still gonna cause problems, but
            // we're not facing them now, so let's deal with that in the future.
            // handle the clicks designed for game playing
            if (this.screenState === "gameplay") {
                //TODO: handle mouse clicks with respect to where they will be placed

                // lets just fire a line, 
                this.player.fireLaser(x,y);
            }

            this.clickableReference.forEach(
                (ind) => {
                    // ignore removed elements
                    if (ind === null) return;
                    let el = this.elements[ind];
                    if (!el) return;
                    // some bounded elements may not necessarily be clickable
                    if (!el["onclick"]) return;

                    let bounds = getBounds(el);

                    if (pointInRect(x, y, bounds[0], bounds[1], bounds[2], bounds[3])) {
                        el["onclick"](el, this);
                    }
                });
        } else if (isRightClick) {
            if (this.screenState === "gameplay") {
                this.player.dashTo(x, y);
            }
        }

	}

    /* given this object, delete it from gs.elements */
    deleteObj(obj) {
        let ind = obj["index"];

        // search through the animated, clickable, collidable references and nullify them
        const mapLookup = {"anim": this.animatedReference, "onclick": this.clickableReference, "oncollide": this.collidableReference};
        for (var key in mapLookup) {
            mapLookup[key].forEach(
                (v, i) => {
                    if (v == ind) {
                        mapLookup[key][i] = null; 
                    }
                }
            );
        }

        this.elements[ind] = null;
    }
}
