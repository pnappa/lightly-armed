
class Laser {
    constructor(player, startPos, endPos) {
        // shallow clone
        this.res = Object.assign({}, RESOURCES['ray_projectile']);
        // set position 
        // TODO: add cooldown, and check
        // TODO: make this obj not the toppest z-level?

        this.res["pos"] = [startPos, endPos];

        this.player = player;

        // rgba
        this.colour = [255, 0, 0, 1];
    }


    draw(ctx, renderer) {
        // XXX: this feels a bit hacky to call a private fn.
        // but i wanna reuse shape drawing. perhaps let's refactor that out of _draw, and
        // into helper fns for renderer? makes sense imo.
        renderer._draw(this.res);
    }

    update(dt) {
        // update its lifetime
        this.res.lifetime -= dt;
        if (this.res.lifetime <= 0) {
            this.player.removeLaser();
            return;
        }

        // set some opacity m8
        this.colour[3] = this.res.lifetime/this.res.startinglifetime;

        // set the colour to a canvas friendly str
        this.res.colour = colToRgbaStr(this.colour);
    }
}

class Player {
    constructor(x, y, gs) {
        // location of player in canvas
        this.xpos = x;
        this.ypos = y;
        // RADIANS
        this.rotation = 0;

        this.isDashing = false;

        this.laser = null;

        this.gameState = gs;

        // player sprite and properties
        this.swidth = 30;
        this.sheight = 30;

        this.xvel = 0;
        this.yvel = 0;

        this.img = new Image();
        this.img.src = "resources/player.svg";

        this.zlevel = 50;
    }

    draw(ctx, renderer) {
        // draw laser below player
        if (this.laser) this.laser.draw(ctx, renderer);

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
        // XXX: don't fire laser if we already have one..?
        if (this.laser) return;
        console.log('firing muh laz0r');

        // TODO: fire at eye location, rather than center of character?
        this.laser = new Laser(this, [this.xpos + this.swidth/2, this.ypos + this.sheight/2], [x, y]);
    }

    removeLaser() {
        this.laser = null;
    }

    lookTowards(x, y) {
        // given this mouse pos, rotate the character towards this point
        let xOffset = -((this.xpos + this.swidth/2) - x);
        let yOffset = -((this.ypos + this.sheight/2) - y);

        this.rotation = Math.atan2(yOffset, xOffset);
    }

    // invoked when moving with WASD
    playerAddVel(xvel, yvel) {
        // don't move if dashing
        if (this.isDashing) return;

        this.xvel += xvel;
        this.yvel += yvel;

        // when the |speedVec| > CHAR_SPEED, clamp
        // this fixes that diagonal movement is faster than cardinal
        let velLength = Math.sqrt(this.xvel*this.xvel + this.yvel*this.yvel);
        if (velLength > CHAR_SPEED) {
            this.xvel *= CHAR_SPEED/velLength;
            this.yvel *= CHAR_SPEED/velLength;
        }
    }

    // add dash velocity to this position
    dashTo(x, y) {
        if (this.isDashing) return;

        this.isDashing = true;

        let xDashVec = (x - (this.xpos + this.swidth/2));
        let yDashVec = (y - (this.ypos + this.sheight/2));

        // convert s.t. |x + y| = 1
        let shrinkage = Math.sqrt(xDashVec*xDashVec + yDashVec*yDashVec);
        xDashVec /= shrinkage;
        yDashVec /= shrinkage;

        // then multiply by DASH_POWER to set dash vel
        this.xvel = xDashVec * DASH_POWER;
        this.yvel = yDashVec * DASH_POWER;
    }

    finishedDashing() {
        return this.xvel < CHAR_SPEED/2 && this.yvel < CHAR_SPEED/2 && this.isDashing;
    }

    // handle all movements, and collisions
    update(dt) {
        if (this.laser) this.laser.update(dt);
        // nothing to do for a stationary player
        if (isZero(this.xvel) && isZero(this.yvel)) return;

        // XXX: very basic collision detection/resolution, probably should replace
        let futureCol = false;
        let futurePosX = this.xpos + this.xvel * dt;
        let futurePosY = this.ypos + this.yvel * dt;

        let playerBounds = [futurePosX, futurePosY, this.swidth, this.sheight];

        // TODO: add different types of collisions
        //      - circle/rect (so the character doesn't get stuck on corners)
        //      - non-AABB?
        // check collisions
        // XXX: replace this dumb method (where no interpolation is done)
        this.gameState.collidableReference.forEach((el, index) => {
            el = this.gameState.elements[el];
            if (rectsIntersect(playerBounds, getBounds(el))) {
                futureCol = true;
            }
        });

        if (!futureCol) {
            // move the players location += this vector
            this.xpos = futurePosX;
            this.ypos = futurePosY;
        } else {
            // XXX: currently set both velocities to 0, might just change the only impacting one?
            // like, if I am travelling up and to the right, but I hit an object to my right
            // i should still have my vertical vel?
            this.xvel = 0;
            this.yvel = 0;
        }

        // apply friction, add -ve vector * friction scalar
        this.xvel += -FRICTION * this.xvel * dt;
        this.yvel += -FRICTION * this.yvel * dt;

        if (this.finishedDashing()) this.isDashing = false;
    }
}
