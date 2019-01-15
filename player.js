
class Laser {
    constructor(player, startPos, endPos) {
        // shallow clone
        this.res = Object.assign({}, RESOURCES['ray_projectile']);
        // set position 
        this.res["pos"] = [startPos, endPos];

        this.player = player;

        // rgba
        this.colour = [255, 0, 0, 1];
    }


    draw(ctx, renderer) {
        renderer.drawObj(this.res);
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
        this.swidth = 20;
        this.sheight = 20;

        this.xvel = 0;
        this.yvel = 0;

        this.img = new Image();
        this.img.src = "resources/player.svg";

        this.zlevel = 50;
    }

    draw(ctx, renderer) {
        // draw laser below player
        if (this.laser) this.laser.draw(ctx, renderer);

        // draw bounding box
        renderer.drawRect({
            "pos": [this.xpos, this.ypos],
            "width": this.swidth,
            "height": this.sheight,
            "colour": "rgba(0, 255, 0, 0.6)"
        });

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
        // TODO: add cooldown, and check
        // XXX: don't fire laser if we already have one..?
        if (this.laser) return;

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
        return Math.abs(this.xvel) < CHAR_SPEED/2 && Math.abs(this.yvel) < CHAR_SPEED/2 && this.isDashing;
    }

    // return the number of pixels separating this character and the supplied bounding box
    _xDistance(objBounds) {
        // if coming from the left
        if (this.xvel > 0) {
            // leftmost point of rect minus rightmost point of plyaer
            return objBounds[0] - (this.xpos + this.swidth);
        } else {
            // coming from the right
            // left point of player minus rightmost point
            return this.xpos - (objBounds[0] + objBounds[2]);
        }
    }

    _yDistance(objBounds) {
        // coming from the top 
        if (this.yvel > 0) {
            return objBounds[1] - (this.ypos + this.sheight);
        } else {
            // from the bottom
            return this.ypos - (objBounds[1] + objBounds[3]);
        }
    }

    // handle all movements, and collisions
    update(dt) {
        if (this.laser) this.laser.update(dt);
        if (this.finishedDashing()) this.isDashing = false;
        // nothing to do for a stationary player
        if (isZero(this.xvel) && isZero(this.yvel)) return;

        // find all objects the player will hit if travelling that distance

        // all gameState collidable objects that we hit if we move to futurePos
        let futureCollisions = [];
        let futurePosX = this.xpos + this.xvel * dt;
        let futurePosY = this.ypos + this.yvel * dt;

        let playerBounds = [futurePosX, futurePosY, this.swidth, this.sheight];

        // TODO: add different types of collisions
        //      - circle/rect (so the character doesn't get stuck on corners)
        //      - non-AABB?
        // check collisions
        this.gameState.collidableReference.forEach((el, index) => {
            el = this.gameState.elements[el];
            let elBounds = getBounds(el);
            if (rectsIntersect(playerBounds, elBounds)) {
                futureCollisions.push(el);
            }
        });

        if (futureCollisions.length == 0) {
            // move the players location += this vector
            this.xpos = futurePosX;
            this.ypos = futurePosY;
        } else {
            // TODO: add some iota test, that will stop people getting caught on tiles
            // either this, or convert from tiles into meshes...
            function getFirstCollision(player) {
                // find closest object, based on the percentage of the distance by the velocity vector
                // XXX: this assumes rectangles
                const INFDIST = 1e9;
                let firstCollision = {propDist: INFDIST, obj: null, xProp: null, yProp: null};

                futureCollisions.forEach((el) => {
                    let objBounds = getBounds(el);
                    let xDist = null;
                    let yDist = null;
                    // what percentage of the xvel vector we are away this frame
                    // 1 == furthest, 0 == already touching
                    let proportionalXDist = INFDIST;
                    let proportionalYDist = INFDIST;

                    xDist = player._xDistance(objBounds);
                    if (xDist > 0) proportionalXDist = xDist/(Math.abs(player.xvel)*dt);
                    yDist = player._yDistance(objBounds);
                    if (yDist > 0) proportionalYDist = yDist/(Math.abs(player.yvel)*dt);

                    if (Math.min(proportionalXDist, proportionalYDist) < firstCollision.propDist) {
                        firstCollision = {propDist: Math.min(proportionalXDist, proportionalYDist), obj: el, xProp: proportionalXDist, yProp: proportionalYDist};
                    }
                });

                return firstCollision;
            }

            let firstCollision = getFirstCollision(this);

            // hit from the side
            if (firstCollision.propDist === firstCollision.xProp) {
                //console.log('side1');
                let estDist = firstCollision.xProp * this.xvel;
                this.xpos += (estDist - (Math.sign(this.xvel)*epsilon)) * dt;
                this.xvel = 0;
            } else if (firstCollision.propDist === firstCollision.yProp) {
                //console.log('top1');
                let estDist = firstCollision.yProp * this.yvel;
                this.ypos += (estDist - (Math.sign(this.yvel)*epsilon)) * dt;
                this.yvel = 0;
            }

            // then, do the same thing for the remaining axis
            firstCollision = getFirstCollision(this);

            // we then test whether if the other axis
            // continues unabated, whether it collides with another object, and resolve then.
            
            // hit from the side
            if (firstCollision.propDist === firstCollision.xProp) {
                //console.log('side2');
                let estDist = firstCollision.xProp * this.xvel;
                this.xpos += (estDist - (Math.sign(this.xvel)*epsilon)) * dt;
            } else if (firstCollision.propDist === firstCollision.yProp) {
                //console.log('top2');
                let estDist = firstCollision.yProp * this.yvel;
                this.ypos += (estDist - (Math.sign(this.yvel)*epsilon)) * dt;
            } else {
                //console.log('else');
                // no collision remaining
                this.xpos += this.xvel*dt; 
                this.ypos += this.yvel*dt; 
            }
        }

        // apply friction, add -ve vector * friction scalar
        this.xvel += -FRICTION * this.xvel * dt;
        this.yvel += -FRICTION * this.yvel * dt;
    }
}
