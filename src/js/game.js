/* globals util */
/**
 * 游戏逻辑模块
 */
const game = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let module = {},
		local = {},
		gameArray;//整个游戏的数据，是一个二维数组

	/*--------------------逻辑相关--------------------*/
	{
		/**
		 * 初始化游戏数组
		 * @param value
		 */
		local.initGameArray = (value = global.CELL_DEFAULT)=> {
			gameArray = [];
			for (let i = 0; i < global.GRID_SIZE; i++) {
				gameArray[i] = [];
				for (let j = 0; j < global.GRID_SIZE; j++) {
					gameArray[i][j] = {
						value: value,
						isMerged: false
					};
				}
			}
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
			// let cloneArray = [];
			// for (let i = 0; i < global.GRID_SIZE; i++) {
			// 	cloneArray[i] = [];
			// 	for (let j = 0; j < global.GRID_SIZE; j++) {
			// 		cloneArray[i][j] = {
			// 			value: gameArray[i][j].value,
			// 			isMerged: gameArray[i][j].isMerged
			// 		};
			// 	}
			// }
			// return cloneArray;
			return util.cloneData(gameArray);
		};

		/**
		 * 重置合并的状态
		 */
		module.resetGameArrayState = (data = gameArray)=> {
			for (let i = 0; i < global.GRID_SIZE; i++) {
				for (let j = 0; j < global.GRID_SIZE; j++) {
					if (data[i][j].isMerged) {
						data[i][j].isMerged = false;
					}
				}
			}
		};

		/**
		 * 判断数组是否有空位
		 * @param data
		 * @returns {boolean}
		 */
		module.isEmpty = (data = gameArray)=> {
			for (let i = 0; i < global.GRID_SIZE; i++) {
				for (let j = 0; j < global.GRID_SIZE; j++) {
					if (data[i][j].value === global.CELL_DEFAULT) { return true; }
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
				case global.ACTION_LEFT:
					for (let i = 0; i < global.GRID_SIZE; i++) {
						for (let j = 1; j < global.GRID_SIZE; j++) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								if (data[i][j - 1].value === global.CELL_DEFAULT ||
									data[i][j - 1].value === data[i][j].value) {
									return true;
								}
							}
						}
					}
					break;
				case global.ACTION_UP:
					for (let j = 0; j < global.GRID_SIZE; j++) {
						for (let i = 1; i < global.GRID_SIZE; i++) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								if (data[i - 1][j].value === global.CELL_DEFAULT ||
									data[i - 1][j].value === data[i][j].value) {
									return true;
								}
							}
						}
					}
					break;
				case global.ACTION_RIGHT:
					for (let i = 0; i < global.GRID_SIZE; i++) {
						for (let j = global.GRID_SIZE - 2; j >= 0; j--) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								if (data[i][j + 1].value === global.CELL_DEFAULT ||
									data[i + 1][j].value === data[i][j].value) {
									return true;
								}
							}
						}
					}
					break;
				case global.ACTION_DOWN:
					for (let j = 0; j < global.GRID_SIZE; j++) {
						for (let i = global.GRID_SIZE - 2; i >= 0; i--) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								if (data[i + 1][j].value === global.CELL_DEFAULT ||
									data[i + 1][j].value === data[i][j].value) {
									return true;
								}
							}
						}
					}
					break;
				case global.ACTION_ALL:
					return module.isMovable(global.ACTION_LEFT, data) ||
					module.isMovable(global.ACTION_UP, data) ||
					module.isMovable(global.ACTION_RIGHT, data) ||
					module.isMovable(global.ACTION_DOWN, data);
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
		module.isConnected = (row1, row2, col1, col2, data = gameArray)=> {
			//水平方向
			if (row1 === row2) {
				for (let i = col1 + 1; i < col2; i++) {
					if (data[row1][i].value !== global.CELL_DEFAULT) {
						return false;
					}
				}
			}
			//垂直方向
			if (col1 === col2) {
				for (let i = row1 + 1; i < row2; i++) {
					if (data[i][col1].value !== global.CELL_DEFAULT) {
						return false;
					}
				}
			}
			return true;
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
			for (let i = 0; i < global.GRID_SIZE; i++) {
				for (let j = 0; j < global.GRID_SIZE; j++) {
					if (data[i][j].value === global.CELL_DEFAULT) {
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
			data[randX][randY].value = randValue;
			return {
				x: randX,
				y: randY,
				value: randValue
			};
			//return [randX, randY, randValue];
		};

		/**
		 * 移动局面
		 * @param direction
		 * @param data
		 * @returns {*}
		 */
		module.moveTo = (direction, data = gameArray)=> {
			let result = {}, results = [], flag = false;
			//如果局面不能移动
			if (!module.isMovable(direction, data)) {
				if (module.isEmpty(data)) { return results; }
				return false;
			}
			switch (direction) {
				case global.ACTION_LEFT:
					for (let i = 0; i < global.GRID_SIZE; i++) {
						for (let j = 1; j < global.GRID_SIZE; j++) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								for (let k = 0; k < j; k++) {
									//直接移动
									if (module.isConnected(i, i, k, j, data) && data[i][k].value === global.CELL_DEFAULT) {
										data[i][k].value = data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										flag = true;
									}
									//移动并且合并
									else if (module.isConnected(i, i, k, j, data) && data[i][k].value === data[i][j].value && !data[i][k].isMerged) {
										data[i][k].value += data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										data[i][k].isMerged = true;
										flag = true;
									}
									if (flag) {
										result.fromX = i;
										result.fromY = j;
										result.toX = i;
										result.toY = k;
										results.push(result);
										flag = false;
										break;
									}
								}
							}
						}
					}
					break;
				case global.ACTION_UP:
					for (let j = 0; j < global.GRID_SIZE; j++) {
						for (let i = 1; i < global.GRID_SIZE; i++) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								for (let k = 0; k < i; k++) {
									//直接移动
									if (module.isConnected(k, i, j, j, data) && data[k][j].value === global.CELL_DEFAULT) {
										data[k][j].value = data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										flag = true;
									}
									//移动并且合并
									else if (module.isConnected(k, i, j, j, data) && data[k][j].value === data[i][j].value && !data[k][j].isMerged) {
										data[k][j].value += data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										data[k][j].isMerged = true;
										flag = true;
									}
									if (flag) {
										result.fromX = i;
										result.fromY = j;
										result.toX = i;
										result.toY = k;
										results.push(result);
										flag = false;
										break;
									}
								}
							}
						}
					}
					break;
				case global.ACTION_RIGHT:
					for (let i = 0; i < global.GRID_SIZE; i++) {
						for (let j = global.GRID_SIZE - 2; j >= 0; j--) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								for (let k = global.GRID_SIZE - 1; k > j; k--) {
									//直接移动
									if (module.isConnected(i, i, j, k, data) && data[i][k].value === global.CELL_DEFAULT) {
										data[i][k].value = data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										flag = true;
									}
									//移动并且合并
									else if (module.isConnected(i, i, j, k, data) && data[i][k].value === data[i][j].value && !data[i][k].isMerged) {
										data[i][k].value += data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										data[i][k].isMerged = true;
										flag = true;
									}
									if (flag) {
										result.fromX = i;
										result.fromY = j;
										result.toX = i;
										result.toY = k;
										results.push(result);
										flag = false;
										break;
									}
								}
							}
						}
					}
					break;
				case global.ACTION_DOWN:
					for (let j = 0; j < global.GRID_SIZE; j++) {
						for (let i = global.GRID_SIZE - 2; i >= 0; i--) {
							if (data[i][j].value !== global.CELL_DEFAULT) {
								for (let k = global.GRID_SIZE - 1; k > i; k--) {
									//直接移动
									if (module.isConnected(i, k, j, j, data) && data[k][j].value === global.CELL_DEFAULT) {
										data[k][j].value = data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										flag = true;
									}
									//移动并且合并
									else if (module.isConnected(i, k, j, j, data) && data[k][j].value === data[i][j].value && !data[k][j].isMerged) {
										data[k][j].value += data[i][j].value;
										data[i][j].value = global.CELL_DEFAULT;
										data[k][j].isMerged = true;
										flag = true;
									}
									if (flag) {
										result.fromX = i;
										result.fromY = j;
										result.toX = i;
										result.toY = k;
										results.push(result);
										flag = false;
										break;
									}
								}
							}
						}
					}
					break;
			}
			return results;
		};

		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.log("----------game init----------");
			local.initGameArray();
		};

	}

	return module;
})();