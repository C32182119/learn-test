(function () {
	"use strict";
	let config = [
		"../js/util.js",
		"../js/animation.js",
		"../js/game.js",
		"../js/ai.js"
	];
	if (typeof importScripts !== "undefined") {
		importScripts(...config);
		game.init();
		ai.init();
		let start = (new Date()).getTime(), end;
		game.createOneNumber();
		game.createOneNumber();
		while (!game.isGameOver()) {
			let data, move;
			data = game.getGameArray();
			move = ai.getBestMove(data);
			if (move !== -1) {
				if (game.isMovable(move)) {
					game.moveTo(move, data, false);
					game.createOneNumber();
					if ( end === undefined && game.getMaxNumber() >= 2048) {
						end = (new Date()).getTime();
					}
				}
			}
		}
		if (end === undefined) {
			end = (new Date()).getTime();
		}
		postMessage({ max: game.getMaxNumber(), time: end - start });
	}
})();