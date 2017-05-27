/* globals util, animation */
/**
 * 游戏逻辑模块
 */
const game = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let module = {}, local = {},
		//整个游戏的数据，是一个二维数组
		gameArray,
		isMerged;

	/*--------------------逻辑相关--------------------*/
	{
		/**
		 * 初始化游戏数组
		 * @param value
		 */
		local.initGameArray = (value = global.GAME_CELL_DEFAULT)=> {
			for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
				gameArray[i] = [];
				isMerged[i] = [];
				for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
					gameArray[i][j] = value;
					isMerged[i][j] = false;
				}
			}
		};

		local.isInGrid = (pos)=> {
			return (pos.x >= 0 && pos.x < global.GAME_GRID_SIZE) &&
				(pos.y >= 0 && pos.y < global.GAME_GRID_SIZE);
		};

		local.isConnected = (fromA, toB, moveVector, data = gameArray)=> {
			let isConnected = true;
			while (fromA.x !== toB.x || fromA.y !== toB.y) {
				fromA.x += moveVector.x;
				fromA.y += moveVector.y;
				if (!(toB.x === fromA.x && toB.y === fromA.y) &&
					data[fromA.x][fromA.y] !== global.GAME_CELL_DEFAULT) {
					isConnected = false;
					break;
				}
			}
			return isConnected;
		};
	}

	/*--------------------模块相关--------------------*/
	{
		/**
		 * 获得游戏数组
		 * @returns {*}
		 */
		module.getGameArray = ()=> {
			return gameArray;
		};

		/**
		 * 复制游戏数组
		 * @returns {Array}
		 */
		module.cloneGameArray = ()=> {
			return util.cloneData(gameArray);
		};

		/**
		 * 重置合并的状态
		 */
		module.resetGameArrayState = ()=> {
			for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
				for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
					if (isMerged[i][j]) {
						isMerged[i][j] = false;
					}
				}
			}
		};

		/**
		 * 获得最大数
		 * @param data
		 * @returns {number}
		 */
		module.getMaxNumber = (data = gameArray)=> {
			let max = -Infinity;
			data.forEach((array) => {
				max = Math.max(max, ...array);
			});
			return max;
		};

		/**
		 * 判断数组是否有空位
		 * @param data
		 * @returns {boolean}
		 */
		module.isEmpty = (data = gameArray)=> {
			for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
				for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
					if (data[i][j] === global.GAME_CELL_DEFAULT) { return true; }
				}
			}
			return false;
		};

		/**
		 * 判断当前局面是否能移动
		 * @param direction
		 * @param data
		 * @returns {boolean}
		 */
		module.isMovable = (direction, data = gameArray)=> {
			switch (direction) {
				case global.GAME_ACTION_LEFT:
					for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
						for (let j = 1; j < global.GAME_GRID_SIZE; j++) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								if (data[i][j - 1] === global.GAME_CELL_DEFAULT ||
									data[i][j - 1] === data[i][j]) {
									return true;
								}
							}
						}
					}
					break;
				case global.GAME_ACTION_UP:
					for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
						for (let i = 1; i < global.GAME_GRID_SIZE; i++) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								if (data[i - 1][j] === global.GAME_CELL_DEFAULT ||
									data[i - 1][j] === data[i][j]) {
									return true;
								}
							}
						}
					}
					break;
				case global.GAME_ACTION_RIGHT:
					for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
						for (let j = global.GAME_GRID_SIZE - 2; j >= 0; j--) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								if (data[i][j + 1] === global.GAME_CELL_DEFAULT ||
									data[i][j + 1] === data[i][j]) {
									return true;
								}
							}
						}
					}
					break;
				case global.GAME_ACTION_DOWN:
					for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
						for (let i = global.GAME_GRID_SIZE - 2; i >= 0; i--) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								if (data[i + 1][j] === global.GAME_CELL_DEFAULT ||
									data[i + 1][j] === data[i][j]) {
									return true;
								}
							}
						}
					}
					break;
				case global.GAME_ACTION_ALL:
					return module.isMovable(global.GAME_ACTION_LEFT, data) ||
					module.isMovable(global.GAME_ACTION_UP, data) ||
					module.isMovable(global.GAME_ACTION_RIGHT, data) ||
					module.isMovable(global.GAME_ACTION_DOWN, data);
			}
			return false;
		};

		/**
		 * 判断某行或列上的两个格子之间是否连通
		 * @param row1
		 * @param row2
		 * @param col1
		 * @param col2
		 * @param data
		 * @returns {boolean}
		 */
		// module.isConnected = (row1, row2, col1, col2, data = gameArray)=> {
		// 	//水平方向
		// 	if (row1 === row2) {
		// 		for (let i = col1 + 1; i < col2; i++) {
		// 			if (data[row1][i] !== global.GAME_CELL_DEFAULT) {
		// 				return false;
		// 			}
		// 		}
		// 	}
		// 	//垂直方向
		// 	if (col1 === col2) {
		// 		for (let i = row1 + 1; i < row2; i++) {
		// 			if (data[i][col1] !== global.GAME_CELL_DEFAULT) {
		// 				return false;
		// 			}
		// 		}
		// 	}
		// 	return true;
		// };

		/**
		 * 判断游戏是否结束
		 * @param data
		 * @returns {boolean}
		 */
		module.isGameOver = (data = gameArray)=> {
			return (!module.isEmpty(data) && !module.isMovable(global.GAME_ACTION_ALL, data));
		};

		/**
		 * 随机生成一个数字
		 * @param data
		 * @returns {*}
		 */
		module.createOneNumber = (data = gameArray)=> {
			let emptyCell = [], randN, randX, randY, randValue;
			// 若当前格子已经被占满
			if (!module.isEmpty(data)) { return {}; }
			//随机一个位置
			for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
				for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
					if (data[i][j] === global.GAME_CELL_DEFAULT) {
						emptyCell.push(i + "," + j);
					}
				}
			}
			randN = parseInt(Math.floor(Math.random() * emptyCell.length));
			randX = parseInt(emptyCell[randN].split(",")[0]);
			randY = parseInt(emptyCell[randN].split(",")[1]);
			//随机一个数字
			randValue = Math.random() < 0.9 ? 2 : 4;
			//在随机位置显示随机数字
			data[randX][randY] = randValue;
			return { x: randX, y: randY, value: randValue };
		};

		module.moveTo = (direction, data = gameArray, isShowAnimation = true)=> {
			let core = (function (direction) {
					let res = {};
					switch (direction) {
						case global.GAME_ACTION_LEFT:
							res.start = { x: 0, y: 0 };
							res.move = { x: 0, y: -1 };
							res.traversal = { x: 1, y: 0 };
							break;
						case global.GAME_ACTION_UP:
							res.start = { x: 0, y: 0 };
							res.move = { x: -1, y: 0 };
							res.traversal = { x: 0, y: 1 };
							break;
						case global.GAME_ACTION_RIGHT:
							res.start = { x: 0, y: 3 };
							res.move = { x: 0, y: 1 };
							res.traversal = { x: 1, y: 0 };
							break;
						case global.GAME_ACTION_DOWN:
							res.start = { x: 3, y: 0 };
							res.move = { x: 1, y: 0 };
							res.traversal = { x: 0, y: 1 };
							break;
					}
					return res;
				})(direction);
			let current, next, merged, pos;
			while (local.isInGrid(core.start)) {
				current = { x: core.start.x, y: core.start.y };
				merged = [ false, false, false, false ];
				pos = 0;
				while (local.isInGrid(current)) {
					next = { x: current.x - core.move.x, y: current.y - core.move.y };
					while (local.isInGrid(next)) {
						while (local.isInGrid(next) && data[next.x][next.y] === global.GAME_CELL_DEFAULT) {
							next.x -= core.move.x;
							next.y -= core.move.y;
						}
						if (!local.isInGrid(next)) {
							next.x += core.move.x;
							next.y += core.move.y;
							if (data[next.x][next.y] === global.GAME_CELL_DEFAULT) {
								break;
							}
						}
						//直接移动
						if (data[current.x][current.y] === global.GAME_CELL_DEFAULT) {
							data[current.x][current.y] = data[next.x][next.y];
							data[next.x][next.y] = global.GAME_CELL_DEFAULT;
							if (isShowAnimation) {
								animation.showMoveTo(next.x, next.y, current.x, current.y);
							}
						}
						//移动并且合并
						else if (data[current.x][current.y] === data[next.x][next.y] && merged[pos] === false &&
							local.isConnected(util.clone(next), util.clone(current), core.move)) {
							data[current.x][current.y] += data[next.x][next.y];
							data[next.x][next.y] = global.GAME_CELL_DEFAULT;
							merged[pos] = true;
							if (isShowAnimation) {
								animation.showMoveTo(next.x, next.y, current.x, current.y);
							}
						}

						next.x -= core.move.x;
						next.y -= core.move.y;
					}
					current.x -= core.move.x;
					current.y -= core.move.y;
					pos++;
				}
				core.start.x += core.traversal.x;
				core.start.y += core.traversal.y;
			}
		};

		/**
		 * 移动局面
		 * @param direction
		 * @param data
		 * @param isShowAnimation
		 */
		module.moveToX = (direction, data = gameArray, isShowAnimation = true)=> {
			switch (direction) {
				case global.GAME_ACTION_LEFT:
					for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
						for (let j = 1; j < global.GAME_GRID_SIZE; j++) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								for (let k = 0; k < j; k++) {
									//直接移动
									if (module.isConnected(i, i, k, j, data) && data[i][k] === global.GAME_CELL_DEFAULT) {
										data[i][k] = data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, i, k);
										}
										break;
									}
									//移动并且合并
									else if (module.isConnected(i, i, k, j, data) && data[i][k] === data[i][j] && !isMerged[i][k]) {
										data[i][k] += data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										isMerged[i][k] = true;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, i, k);
										}
										break;
									}
								}
							}
						}
					}
					break;
				case global.GAME_ACTION_UP:
					for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
						for (let i = 1; i < global.GAME_GRID_SIZE; i++) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								for (let k = 0; k < i; k++) {
									//直接移动
									if (module.isConnected(k, i, j, j, data) && data[k][j] === global.GAME_CELL_DEFAULT) {
										data[k][j] = data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, k, j);
										}
										break;
									}
									//移动并且合并
									else if (module.isConnected(k, i, j, j, data) && data[k][j] === data[i][j] && !isMerged[k][j]) {
										data[k][j] += data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										isMerged[k][j] = true;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, k, j);
										}
										break;
									}
								}
							}
						}
					}
					break;
				case global.GAME_ACTION_RIGHT:
					for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
						for (let j = global.GAME_GRID_SIZE - 2; j >= 0; j--) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								for (let k = global.GAME_GRID_SIZE - 1; k > j; k--) {
									//直接移动
									if (module.isConnected(i, i, j, k, data) && data[i][k] === global.GAME_CELL_DEFAULT) {
										data[i][k] = data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, i, k);
										}
										break;
									}
									//移动并且合并
									else if (module.isConnected(i, i, j, k, data) && data[i][k] === data[i][j] && !isMerged[i][k]) {
										data[i][k] += data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										isMerged[i][k] = true;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, i, k);
										}
										break;
									}
								}
							}
						}
					}
					break;
				case global.GAME_ACTION_DOWN:
					for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
						for (let i = global.GAME_GRID_SIZE - 2; i >= 0; i--) {
							if (data[i][j] !== global.GAME_CELL_DEFAULT) {
								for (let k = global.GAME_GRID_SIZE - 1; k > i; k--) {
									//直接移动
									if (module.isConnected(i, k, j, j, data) && data[k][j] === global.GAME_CELL_DEFAULT) {
										data[k][j] = data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, k, j);
										}
										break;
									}
									//移动并且合并
									else if (module.isConnected(i, k, j, j, data) && data[k][j] === data[i][j] && !isMerged[k][j]) {
										data[k][j] += data[i][j];
										data[i][j] = global.GAME_CELL_DEFAULT;
										isMerged[k][j] = true;
										if (isShowAnimation) {
											animation.showMoveTo(i, j, k, j);
										}
										break;
									}
								}
							}
						}
					}
					break;
			}
			module.resetGameArrayState();
		};

		/**
		 * 初始化
		 */
		module.init = ()=> {
			gameArray = [];
			isMerged = [];
			local.initGameArray();
		};

	}

	return module;
})();