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

    drawLine(lineObj) {
        this.ctx.beginPath();
        this.ctx.lineWidth = lineObj.width;
        this.ctx.strokeStyle = lineObj.colour;
        this.ctx.moveTo(lineObj.pos[0][0], lineObj.pos[0][1]);
        this.ctx.lineTo(lineObj.pos[1][0], lineObj.pos[1][1]);
        this.ctx.stroke();
    }

    drawRect(rectObj) {
        this.ctx.fillStyle = rectObj.colour;
        this.ctx.fillRect(rectObj.pos[0], rectObj.pos[1], rectObj.width, rectObj.height);
    }

    drawImg(imgObj) {
        if ("width" in imgObj) {
            this.ctx.drawImage(imgObj.src, imgObj.pos[0], imgObj.pos[1], imgObj.width, imgObj.height);			
        } else {
            this.ctx.drawImage(imgObj.src, imgObj.pos[0], imgObj.pos[1]);
        }
    }

    drawText(textObj) {
        this.ctx.fillStyle = textObj.colour;
        this.ctx.font = "" + textObj["font-size"] + "px " + textObj["font-family"];
        if ("font-weight" in textObj) { 
            this.ctx.font = textObj["font-weight"] + " " + this.ctx.font;
        }
        this.ctx.fillText(textObj.value, textObj["pos"][0], textObj["pos"][1]);
    }

	drawObj(obj) {
		this.ctx.save();

        // TODO: make this rotation around the object origin, not the 0,0 point
		if ("rotation" in obj) {
			this.ctx.rotate(obj.rotation);
		}

		if (obj.type === "text") {
            this.drawText(obj);
		} else if (obj.type === "shape") {
			if (obj.shape === "rect") {
                this.drawRect(obj);
			} else if (obj.shape === "line") {
                this.drawLine(obj);
            }
		} else if (obj.type === "image") {
            this.drawImg(obj);
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
            // ignore elements that don't need to be drawn
            if (objs[i]["nodraw"]) continue;
            
            if (typeof objs[i].draw == 'function') { 
                objs[i].draw(this.ctx, this);
            } else {
                this.drawObj(objs[i]);
            }
        }
	}
}
