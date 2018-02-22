
var title_text = new Image();
title_text.src = "resources/title_text.svg";

var RESOURCES = {
	"title_text": title_text,
    "ray_projectile": {
        "colour": "red",
        "shape": "line",
        // defines end points of line
        "pos": [[0,0],[0,0]],
        // girth :o
        "width": 10,
        // how many seconds the object is alive for
        "lifetime": 0.10,
        // have to give it an id to differ it from the rest 
        // make sure to set!
        "id": "",
        "anim": (obj, dt, gs) => {
            // whether to remove oneself
            obj.lifetime -= dt;
            if (obj.lifetime <= 0) {
                gs.deleteObj(obj);
            }
        }
    },
    "player": {
        "colour": "blue",
        "type": "shape",
        "shape": "rect",
        "pos": [100, 100],
        "width": 20,
        "height": 20,
        "id": "" 

    }
}

// these are expanded in init
var Maps = [{
	
}];

var Scenes = {
	"main_menu": {
		"static": [
			// obscures red bars from view underneath title text
			{
				"zlevel": 40,
				"type": "shape",
				"shape": "rect",
				"pos": [0, 0],
				"width": 227,
				"height": 143,
				"colour": "white"
			},
			// gradient menu button
			{
				"zlevel": 40,
				"type": "shape",
				"shape": "rect",
				"pos": [331, 254],
				"width": 269,
				"height": 20,
				"colour": "rgb(14,117,16)"
			},
			{
				"zlevel": 40,
				"type": "shape",
				"shape": "rect",
				"pos": [291, 320],
				"width": 309,
				"height": 20,
				"colour": "rgb(205,8,20)"
			},
			// title text
			{
				"zlevel": 100,
				"type": "image",
				"src": RESOURCES["title_text"],
				"pos": [0, 0]
			},
			// button text
			{
				"type": "text",
				"zlevel": 100,
				"font-family": "Helvetica",
				"font-size": 33.3,
				"font-weight": "lighter",
				"value": "play game",
				"pos": [430, 238], 					
				"colour": "#000000",
			},
			{
				"type": "text",
				"zlevel": 100,
				"font-family": "Helvetica",
				"font-size": 33.3,
				"font-weight": "lighter",
				"value": "join game",
				"pos": [440, 306], 					
				"colour": "#000000",
			},
			{
				"type": "text",
				"zlevel": 100,
				"font-family": "Helvetica",
				"font-size": 33.3,
				"font-weight": "lighter",
				"value": "how to play",
				"pos": [416, 380], 					
				"colour": "#000000",
			}
		],
		"clickable": [
			//menu buttons
			{
				"zlevel": 30,
				"type": "shape",
				"shape": "rect",
				"pos": [331, 188],
				"width": 269,
				"height": 66,
				"colour": "rgb(46,160,203)",
				"bounds": [331, 188, 269, 66],
				"onclick": (obj, gs) => { 
                    console.log("playgame pressed"); 
                    gs.setScreen("game_menu");
                }	
			},
			{
				"zlevel": 30,
				"type": "shape",
				"shape": "rect",
				"pos": [291, 254],
				"width": 309,
				"height": 66,
				"colour": "rgb(224,175,54)",
				"bounds": [281, 254, 319, 66],
				"onclick": (obj, gs) => { console.log("join room pressed"); }	
			},
			{
				"zlevel": 30,
				"type": "shape",
				"shape": "rect",
				"pos": [251, 320],
				"width": 349,
				"height": 83,
				"colour": "rgb(212,62,167)",
				"bounds": [251, 320, 349, 83],
				"onclick": (obj, gs) => { console.log("how to play pressed"); }	
			},
			
			 // random clickable
			 {
			 	"zlevel": 69,
			 	"type": "shape",
			 	"shape": "rect",
			 	"pos": [300, 20],
			 	"width": 50,
			 	"height": 50,
			 	"colour": "red",
			 	"bounds": [300, 20, 100, 100],
			 	"onclick": (obj, gs) => { 
                    gs.deleteObj(obj);
                    //if (obj["colour"] === "red") { obj["colour"] = "blue"; } else { obj["colour"] = "red"; }
                
                }
			 }
		],
		"animation": [
			// LEFT COLUMN bars
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] -= 30*dt;
					const offset = -240;
					if (obj["pos"][1] <= offset) {
						obj["pos"][1] = gs.canvas.height + 0 + (obj["pos"][1] % offset);
					}
				},
				"pos": [39, 300],
				"width": 19,
				"height": 240
			},
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] -= 30*dt;
					const offset = -160;
					if (obj["pos"][1] <= offset) {
						obj["pos"][1] = gs.canvas.height + 80 + (obj["pos"][1] % offset);
					}
				},
				"pos": [39, 60],
				"width": 19,
				"height": 160
			},
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] -= 30*dt;
					const offset = -80;
					while (obj["pos"][1] <= offset) {
						obj["pos"][1] = gs.canvas.height + 160 + (obj["pos"][1] % offset);
					}
				},
				"pos": [39, -50],
				"width": 19,
				"height": 80
			},
			// MIDDLE COL
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] += 40*dt;
					const offset = gs.canvas.height;
					if (obj["pos"][1] >= offset) {
						obj["pos"][1] = -240 + (obj["pos"][1] % offset);
					}
				},
				"pos": [79, 340],
				"width": 19,
				"height": 240
			},
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] += 40*dt;
					const offset = gs.canvas.height+100;
					if (obj["pos"][1] >= offset) {
						obj["pos"][1] = -140 + (obj["pos"][1] % offset);
					}
				},
				"pos": [79, 120],
				"width": 19,
				"height": 140
			},
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] += 40*dt;
					const offset = gs.canvas.height+140;
					if (obj["pos"][1] >= offset) {
						obj["pos"][1] = -100 + (obj["pos"][1] % offset);
					}
				},
				"pos": [79, -30],
				"width": 19,
				"height": 100
			},
			// RIGHT COL
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] -= 10*dt;
					const offset = -240;
					if (obj["pos"][1] <= offset) {
						obj["pos"][1] = gs.canvas.height + 0 + (obj["pos"][1] % offset) ;
					}
				},
				"pos": [119, 320],
				"width": 19,
				"height": 240
			},
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] -= 10*dt;
					const offset = -160;
					if (obj["pos"][1] <= offset) {
						obj["pos"][1] = gs.canvas.height + 80 + (obj["pos"][1] % offset);
					}
				},
				"pos": [119, 80],
				"width": 19,
				"height": 160
			},
			{
				"type": "shape",
				"zlevel": 30,
				"shape": "rect",
				"colour": 'rgb(205,8,20)',
				"anim": (obj,dt,gs) => {
					obj["pos"][1] -= 10*dt;
					const offset = -80;
					if (obj["pos"][1] <= offset) {
						obj["pos"][1] = gs.canvas.height + 160 + (obj["pos"][1] % offset);
					}
				},
				"pos": [119, -50],
				"width": 19,
				"height": 80
			},

			{
				"type": "text",
				"zlevel": 100,
				"font-family": "Arial",
				"font-size": 40,
				"value": "fuck",
				"pos": [400, 300], 					
				"colour": "#bad455",
				"anim": (obj, dt, gs) => {
					obj.pos[0] = (obj.pos[0] + dt * 80) % gs.canvas.width; 
					if (obj.pos[0] < -100) obj.pos[0] = 400;
					obj["font-size"] = ((obj["font-size"] + 1) % 60);
				}
			},

            // test self removal after delay
            {
                "zlevel": 100,
                "type": "shape",
                "shape": "rect",
                "pos": [240, 20],
                "width": 50,
                "height": 50,
                "colour": "blue",
                "bounds": [300, 20, 100, 100],
                "rotation": 0,
                "lifetime": 10,
                "anim": (obj, dt, gs) => { 
                    obj["lifetime"] -= dt;
                    if (obj["lifetime"] < 0) {
                        gs.deleteObj(obj);
                    }
                    obj["rotation"] += dt;
                }
            }
		]
	},
	"game_menu": {
		"static": [],
		"clickable": [],
		"animation": []
	},
    // where the game is played (i.e. controlling characters, etc)
    "gameplay": {
        // i suppose UI?
        "static": [],
        "clickable": [],
        // where drawables can be injected to be affected by the renderer
        "animation": []
    }
}
