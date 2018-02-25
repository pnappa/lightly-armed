
class Player {
    constructor(x, y) {
        // location of player in canvas
        this.xpos = x;
        this.ypos = y;
        // RADIANS
        this.rotation = 0;

        // player sprite and properties
        this.swidth = 30;
        this.sheight = 30;

        this.img = new Image();
        this.img.src = "resources/player.svg";
    }

    draw(ctx) {
        //Convert degrees to radian 
        //let rad = this.rotation * Math.PI / 180;
        let rad = this.rotation;

        //Set the origin to the center of the image
        ctx.translate(this.xpos + this.swidth / 2, this.ypos + this.sheight / 2);

        //Rotate the canvas around the origin
        ctx.rotate(rad);

        //draw the image
        ctx.drawImage(this.img,this.swidth / 2 * (-1),this.sheight / 2 * (-1),this.swidth,this.sheight);

        //reset the canvas
        ctx.rotate(rad * ( -1 ) );
        ctx.translate((this.xpos + this.swidth / 2) * (-1), (this.ypos + this.sheight / 2) * (-1));
    }

    lookTowards(x, y) {
        // given this mouse pos, rotate the character towards this point
        let xOffset = -((this.xpos + this.swidth/2) - x);
        let yOffset = -((this.ypos + this.sheight/2) - y);

        this.rotation = Math.atan2(yOffset, xOffset);
    }
}
