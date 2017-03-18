/* globals util */
/**
 * 游戏逻辑模块
 */
const game = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let module = {},
		local = {},
		gameData;//整个游戏的数据，是一个二维数组

	/*--------------------逻辑相关--------------------*/
	{
		/**
		 * 初始化游戏数组
		 * @param defaultValue
		 */
		local.initGameData = (defaultValue)=> {
			let value = defaultValue || global.CELL_DEFAULT;
			gameData = [];
			for (let i = 0; i < global.GRID_SIZE; i++) {
				gameData[i] = [];
				for (let j = 0; j < global.GRID_SIZE; j++) {
					gameData[i][j] = {
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
		module.getGameData = ()=> {
			return gameData;
		};

		/**
		 * 复制游戏数组
		 * @returns {Array}
		 */
		module.cloneGameData = ()=> {
			let copyData = [];
			for (let i = 0; i < global.GRID_SIZE; i++) {
				copyData[i] = [];
				for (let j = 0; j < global.GRID_SIZE; j++) {
					copyData[i][j] = {
						value: gameData[i][j].value,
						isMerged: gameData[i][j].isMerged
					};
				}
			}
			return copyData;
		};

		/**
		 * 判断数组是否为空
		 * @param data
		 * @returns {boolean}
		 */
		module.isEmpty = (data)=> {
			for (let i = 0; i < global.GRID_SIZE; i++) {
				for (let j = 0; j < global.GRID_SIZE; j++) {
					if (data[i][j].value !== global.CELL_DEFAULT) { return false; }
				}
			}
			return true;
		};

		module.createOneNumber = ()=> {

		};

		//TODO

		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.log("----------game init----------");
			local.initGameData();
		};

		/**
		 * 销毁
		 */
		module.destroy = ()=> {
			util.log("----------game destroy----------");
		};
	}

	return module;
})();