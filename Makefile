# for building the SRI hashes for index.html


index.html: game.js player.js gamestate.js renderer.js resources.js utils.js style.css powerups.js line-segments-intersect.js
	./makehtml.sh
