/* globals util, game, animation, ai */
/**
 * 主程序模块
 */
const main = (()=> {
    "use strict";
	/*--------------------初始化成员变量--------------------*/
    let module = {},
	    local = {};

	/*--------------------内部函数--------------------*/
	{

		local.runAI = (action)=> {

		};

		local.runPlayer = (action)=> {
			let result1, result2, item, timer;
			result1 = game.moveTo(action);
			if (result1 !== false) {
				if (result1.length > 0) {
					timer = setInterval(()=> {
						item = result1.shift();
						if (item) {
							animation.showMoveTo(item.fromX, item.fromY, item.toX, item.toY);
						}
						else {
							clearInterval(timer);
						}
					}, 10);
					setTimeout(()=> {
						animation.updateView(game.getGameArray());
					}, 250);
				}
				result2 = game.createOneNumber();
				if (!util.isEmptyObject(result2)) {
					setTimeout(()=> {
						animation.showCreateNumber(result2.x, result2.y, result2.value);
					}, 300);
					game.resetGameArrayState();
				}
				else {
					//game over
				}
			}
			else {
				//game over
			}
		};
		/**
		 * 监听键盘事件
		 */
		local.listener = ()=> {
			$(document).keydown((event)=> {
				let action;
				//取消事件默认动作
				event.preventDefault();
				switch (event.keyCode) {
					//left & A
					case 37:case 65:
					action = global.ACTION_LEFT;
					break;
					//up & W
					case 38:case 87:
					action = global.ACTION_UP;
					break;
					//right & D
					case 39:case 68:
					action = global.ACTION_RIGHT;
					break;
					//down & S
					case 40:case 83:
					action = global.ACTION_DOWN;
					break;
				}
				if (action) {
					local.runPlayer(action);
				}
			});
		};

		/**
		 * 初始化
		 */
		local.init = ()=> {
			let result1, result2;
			game.init();
			animation.init();
			ai.init();

			animation.updateView(game.getGameArray());

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
		};
	}

    /*--------------------模块相关--------------------*/
	{
		/**
		 * 主程序入口
		 */
		module.start = ()=> {
			util.log("----------main start----------");
			local.init();

			local.listener();

		};

	}

    return module;
})();

main.start();