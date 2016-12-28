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
		//TOOD: draw the object onto the context
	} 

	render() {
		//TODO: based on z-level, draw objects
		// warning! this assumes each array in getDraw is ordered by zlevel
		objs = gameState.getDraws();

		// probe through draw objs to find next z val
		let cIndices = [];
		let lens = [];
		//total indicies we can search
		let sum = 0;
		//current sum of indicies in cIndices
		let cSum = 0;
		for (let _dummy of objs) { 
			cIndex.push(0); 
			lens.push(_dummy.length);
			sum += _dummy.length;
		};

		while (cSum <= sum) {
			//find the next lowest zLevel
			let lowest = Infinity;
			let lowInd = 0;
			let lowObj = null;
			let probe = 0;
			for (let state of objs) {
				//if we found a new minimum, set that as the best candidate for next draw
				if (state[cIndices[probe]]["zlevel"] <= lowest) {
					lowest = state[cIndices[probe]];
					lowInd = probe;
					lowObj = lowest;
				}
				probe++;
			}
			if (!lowObj) throw "invalid render state";
			//draw the candidate
			cSum++;
			_draw(lowObj);
			cIndices[lowInd]++;
		}
	}
}

// function render() {
// 	let sc = state["screen"];

// 	if (sc === "main_menu") {
// 		ren_main();
// 	} else if (sc === "create_room") {
// 		create_room();
// 	} else if (sc === "join_room") {
// 		join_room();
// 	} else if (sc === "waiting_room") {
// 		waiting_room();
// 	} else if (sc === "help_menu") {
// 		help_menu();
// 	} else if (sc === "ingame") {
// 		ingame();
// 	} else {
// 		//???
// 	}
// }