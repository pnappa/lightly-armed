
class Player {
    constructor(x, y, gs) {
        // location of player in canvas
        this.xpos = x;
        this.ypos = y;
        // RADIANS
        this.rotation = 0;

        this.gameState = gs;

        // player sprite and properties
        this.swidth = 30;
        this.sheight = 30;

        this.img = new Image();
        this.img.src = "resources/player.svg";

        this.zlevel = 50;
    }

    draw(ctx) {
        // the rotation code was from stack overflow ... TODO: attribute
        // radians var
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

    fireLaser(x, y) {
        console.log('firing muh laz0r');
        // TODO: add cooldown, and check
        // TODO: make this obj not the toppest z-level?

        // shallow copy, and clone non primitives
        var newLaser = Object.assign({}, RESOURCES['ray_projectile']);
        // TODO: make starting proper x,y pos (eye pos?)
        newLaser["pos"] = [[this.xpos + this.swidth/2, this.ypos + this.sheight/2], [x, y]];

        // add to the gameState
        let index = this.gameState.elements.push(newLaser) - 1;
        newLaser['index'] = index;
        console.log(newLaser);
        this.gameState.animatedReference.push(index);
    }

    lookTowards(x, y) {
        // given this mouse pos, rotate the character towards this point
        let xOffset = -((this.xpos + this.swidth/2) - x);
        let yOffset = -((this.ypos + this.sheight/2) - y);

        this.rotation = Math.atan2(yOffset, xOffset);
    }

    setCollidables(colls) {
        this.collidables = colls;
    }

    move(x, y) {
        let futureCol = false;
        let futurePosX = this.xpos + x;
        let futurePosY = this.ypos + y;

        let playerBounds = [futurePosX, futurePosY, this.swidth, this.sheight];

        // TODO: add different types of collisions
        //      - circle/rect (so the character doesn't get stuck on corners)
        //      - non-AABB?
        // check collisions
        // XXX: replace this dumb method (where no interpolation is done)
        this.gameState.collidableReference.forEach((el, index) => {
            el = this.gameState.elements[el];
            if (rectsIntersect(playerBounds, getBounds(el))) {
                console.log('collision');
                futureCol = true;
            }
        });

        if (!futureCol) {
            // move the players location += this vector
            this.xpos = futurePosX;
            this.ypos = futurePosY;
        }
    }
}
