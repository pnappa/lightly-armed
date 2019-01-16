

// any object activated by pressing E
class Powerup {
    constructor(player) {
        this.player = player;
    }

    update(dt) {

    }

    draw(ctx, renderer) {}
}

// one use, launches with preset power, 
// cooked by holding e, fired on release
// any player/destructable object within X unobstructed pixels is killed
// XXX: for now, just preset timer.
class Grenade extends Powerup {

}

// one time use shield, firing when in use destroys it,
// expires in a few seconds after use
class Shield extends Powerup {
    constructor(player) {
        super(player);
        // 3 seconds of use
        this.remainingTime = 3;
        this.active = false;
    }

    use() {
        this.active = true;
    }

    update(dt) {
        if (this.active) {
            this.remainingTime -= dt;
            // if this shield has expired, remove it from the player
            if (this.remainingTime <= 0) {
                this.player.removePowerUp();
            }
        }
    }

    draw(ctx, renderer) {
        // shields themselves are only drawn 
        if (this.active) {
            renderer.drawText({
            "type": "text",
            "zlevel": 100,
            "font-family": "Helvetica",
            "font-size": 33.3,
            "font-weight": "lighter",
            "value": Number.parseFloat(this.remainingTime).toFixed(3),
            "pos": [40, 130], 					
            "colour": "#000000"});
        }
    }
}
