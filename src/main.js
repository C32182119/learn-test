/* globals util, game, animation, ai */
/**
 * 主程序模块
 */
const main = (()=> {
    "use strict";
	/*--------------------初始化成员变量--------------------*/
    let module = {}, local = {},
		isStop = true;

	/*--------------------内部函数--------------------*/
	{

		local.runAI = ()=> {
			let move = ai.getBestMove(game.getGameArray());
			if (move !== -1) {
				local.runPlayer(move);
			}
			if (!game.isGameOver() && !isStop) {
				setTimeout(()=> {
					local.runAI();
				}, global.AI_MAX_TIME);
			}
		};

		local.runPlayer = (action)=> {
			let result;
			if (!game.isGameOver()) {
				if (game.isMovable(action)) {
					game.moveTo(action);
					result = game.createOneNumber();
					if (!util.isEmptyObject(result)) {
						setTimeout(()=> {
							animation.showCreateNumber(result.x, result.y, result.value);
						}, 200);
						// game.resetGameArrayState();
					}
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
			let keyDown = (event)=> {
				let action;
				switch (event.keyCode) {
					//left & A
					case 37: case 65:
					//取消事件默认动作
					event.preventDefault();
					action = global.GAME_ACTION_LEFT;
					break;
					//up & W
					case 38: case 87:
					//取消事件默认动作
					event.preventDefault();
					action = global.GAME_ACTION_UP;
					break;
					//right & D
					case 39: case 68:
					//取消事件默认动作
					event.preventDefault();
					action = global.GAME_ACTION_RIGHT;
					break;
					//down & S
					case 40: case 83:
					//取消事件默认动作
					event.preventDefault();
					action = global.GAME_ACTION_DOWN;
					break;
				}
				if (action) {
					document.removeEventListener("keydown", keyDown);
					local.runPlayer(action);
					setTimeout(()=> {
						document.addEventListener("keydown", keyDown);
					}, 100);
				}
			};
			document.addEventListener("keydown", keyDown);
		};

		local.runWorkers = (times)=> {
			times = (times !== undefined && times > 0) ? times : 1;
			let workers = [], count = {}, averageTime = [0],
				len = times < global.WORKER_MAX_THREAD ? times : global.WORKER_MAX_THREAD,
				startNum = times, finishNum = 0,
				runWorker = function (index) {
					util.log(`第${ index + 1 }个worker开始执行.`);
					util.log("\n");
					startNum--;
					workers[index] = new Worker("workers/workers.js");
					workers[index].onmessage = function (event) {
						workers[index].terminate();
						let result = event.data.max;
						if (count[result] === undefined) {
							count[result] = 1;
						}
						else {
							count[result]++;
						}
						if (result >= 2048) {
							averageTime[0] += event.data.time;
							averageTime.push(event.data);
						}
						finishNum++;
						util.log(`第${ index + 1 }个worker执行完毕.`);
						if (averageTime.length > 1) {
							util.log(`合成2048平均用时 ${ averageTime[0] / (averageTime.length - 1) / 1000 } 秒.`);
						}
						util.log(`总任务${ times }个, 已完成${ finishNum }个, 还剩${ times - finishNum }个.`);
						util.log(count);
						if (startNum > 0) {
							runWorker(index);
						}
						if (finishNum === times) {
							util.log("全部执行完毕.", count);
						}
					};
				};
			for (let i = 0; i < len; i++) {
				runWorker(i);
			}
		};

	}

    /*--------------------模块相关--------------------*/
	{

		module.init = ()=> {
			game.init();
			animation.init();
			ai.init();
			isStop = true;
			animation.updateView(game.getGameArray());
		};

		module.start = ()=> {
			game.init();
			isStop = true;
			animation.updateView(game.getGameArray());

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

		module.auto = ()=> {
			isStop = !isStop;
			if (!isStop) {
				local.runAI();
				// local.runWorkers(50);
			}
		};

		module.tooltip = ()=> {
			let content = document.getElementById("best-move"),
				move = ai.getBestMove(game.getGameArray()), str = "";
			if (move !== -1) {
				switch (move) {
					case global.GAME_ACTION_LEFT: str = "左"; break;
					case global.GAME_ACTION_UP: str = "上"; break;
					case global.GAME_ACTION_RIGHT: str = "右"; break;
					case global.GAME_ACTION_DOWN: str = "下"; break;
				}
				content.innerHTML = "最佳走法: " + str;
			}
			else {
				content.innerHTML = "当前局面没有最佳走法";
			}
		};

	}

    return module;
})();
