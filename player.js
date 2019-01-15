
class Player {
    constructor(x, y, gs) {
        // location of player in canvas
        this.xpos = x;
        this.ypos = y;
        // RADIANS
        this.rotation = 0;

        this.isDashing = false;

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

    // invoked when moving with WASD
    playerAddVel(xvel, yvel) {
        // don't move if dashing
        if (this.isDashing) return;

        this.xvel += xvel;
        this.yvel += yvel;
        // clamp movement to not be more than CHAR_SPEED
        if (Math.abs(this.xvel) > CHAR_SPEED) this.xvel = Math.sign(xvel) * CHAR_SPEED;
        if (Math.abs(this.yvel) > CHAR_SPEED) this.yvel = Math.sign(yvel) * CHAR_SPEED;
    }

    // add dash velocity to this position
    dashTo(x, y) {
        if (this.isDashing) return;

        console.log("dashing to: ", x, " ", y);
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
        return this.xvel < CHAR_SPEED && this.yvel < CHAR_SPEED && this.isDashing;
    }

    // handle all movements, and collisions
    update(dt) {
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
