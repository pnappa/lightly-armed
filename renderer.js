//
//	Functions used to render UI and other features to the canvas
//
var drawElements = {};
var mainMenuAnims = {};

class Renderer {
	constructor(context, gameState) {
		this.ctx = context;
		this.gs = gameState;
	}

	_draw(obj) {

		this.ctx.save();

        // TODO: make this rotation around the object origin, not the 0,0 point
		if ("rotation" in obj) {
			this.ctx.rotate(obj.rotation);
		}

		if (obj.type === "text") {
			this.ctx.fillStyle = obj.colour;
			this.ctx.font = "" + obj["font-size"] + "px " + obj["font-family"];
			if ("font-weight" in obj) { 
				this.ctx.font = obj["font-weight"] + " " + this.ctx.font;
			}
			this.ctx.fillText(obj.value, obj["pos"][0], obj["pos"][1]);

		} else if (obj.type === "shape") {

			if (obj.shape === "rect") {
				this.ctx.fillStyle = obj.colour;
				this.ctx.fillRect(obj.pos[0], obj.pos[1], obj.width, obj.height);
			} else if (obj.shape === "line") {
                this.ctx.beginPath();
                this.ctx.lineWidth = obj.width;
                this.ctx.strokeStyle = obj.colour;
                this.ctx.moveTo(obj.pos[0][0], obj.pos[0][1]);
                this.ctx.lineTo(obj.pos[1][0], obj.pos[1][1]);
                this.ctx.stroke();
            }

		} else if (obj.type === "image") {
			if ("width" in obj) {
				this.ctx.drawImage(obj.src, obj.pos[0], obj.pos[1], obj.width, obj.height);			
			} else {
				this.ctx.drawImage(obj.src, obj.pos[0], obj.pos[1]);
			}
		} 

		this.ctx.restore();

	} 

	render() {
		this.ctx.clearRect(0,0,gameState.canvas.width,gameState.canvas.height);

		// these are ordered by ascending zlevel [as set by GameState.setScreen(..)]
		let objs = gameState.getDraws();

        for (var i = 0; i < objs.length; ++i) {
            // ignore deleted objects
            if (objs[i] === null) continue;
            
            if (typeof objs[i].draw == 'function') { 
                objs[i].draw(this.ctx, this);
            } else {
                this._draw(objs[i]);
            }
        }
	}
}
