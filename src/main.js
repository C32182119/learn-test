/* globals util, game, animation, ai */
/**
 * 主程序模块
 */
const main = (()=> {
    "use strict";
	/*--------------------初始化成员变量--------------------*/
    let module = {},
	    local = {},
	    moveQueue = [];

	/*--------------------内部函数--------------------*/
	{

		module.runAI = ()=> {
			let isPlayTurn = true;
			while (1) {
				let move = ai.getBestMove(game.getGameArray(), isPlayTurn);
				isPlayTurn = !isPlayTurn;
				if (move !== -1) {
					// local.runPlayer(move);
					moveQueue.push(move);
				}
				else {
					break;
				}
			}
			if (moveQueue.length > 0) {
				setTimeout(()=> {
					local.runPlayer(moveQueue.shift());
				}, 500);
			}
		};

		local.runPlayer = (action)=> {
			let result;
			if (!game.isGameOver()) {
				game.moveTo(action);
				result = game.createOneNumber();
				if (!util.isEmptyObject(result)) {
					setTimeout(()=> {
						animation.showCreateNumber(result.x, result.y, result.value);
					}, 200);
					game.resetGameArrayState();
				}
			}
			else {
				setTimeout(()=> {
					alert("Game Over!");
				}, 200);
			}
		};
		/**
		 * 监听键盘事件
		 */
		local.listener = ()=> {
			setTimeout(()=> {
				$(document).keydown((event)=> {
					let action;
					//取消事件默认动作
					switch (event.keyCode) {
						//left & A
						case 37:
						case 65:
							event.preventDefault();
							action = global.ACTION_LEFT;
							break;
						//up & W
						case 38:
						case 87:
							event.preventDefault();
							action = global.ACTION_UP;
							break;
						//right & D
						case 39:
						case 68:
							event.preventDefault();
							action = global.ACTION_RIGHT;
							break;
						//down & S
						case 40:
						case 83:
							event.preventDefault();
							action = global.ACTION_DOWN;
							break;
					}
					if (action) {
						local.runPlayer(action);
					}
				});
			}, 500);
		};

	}

    /*--------------------模块相关--------------------*/
	{
		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.log("----------main init----------");
			game.init();
			animation.init();
			ai.init();

			$(document).ready(()=> {
				animation.updateView(game.getGameArray());
			});
		};
		/**
		 * 主程序入口
		 */
		module.start = ()=> {
			util.log("----------main start----------");
			let result1, result2;
			result1 = game.createOneNumber();
			if (!util.isEmptyObject(result1)) {
				setTimeout(()=> {
					animation.showCreateNumber(result1.x, result1.y, result1.value);
				}, 10);
			}
			result2 = game.createOneNumber();
			if (!util.isEmptyObject(result2)) {
				setTimeout(()=> {
					animation.showCreateNumber(result2.x, result2.y, result2.value);
				}, 10);
			}





			local.listener();

		};

	}

    return module;
})();

main.init();