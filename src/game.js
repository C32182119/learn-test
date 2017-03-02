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
		 * 初始化游戏数据
		 * @param defaultValue
		 * @returns {Array}
		 */
		local.initGameData = (defaultValue)=> {
			let value = defaultValue || global.CELL_MIN;
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
			return gameData;
		};

		/**
		 * 获得游戏数据
		 * @returns {*|Array}
		 */
		module.getGameData = ()=> {
			return gameData || local.initGameData();
		};

		/**
		 * 复制游戏数据
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

		module.createOneNumber = ()=> {

		};

	}

	/*--------------------模块相关--------------------*/
	{
		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.print("----------game init----------");
			local.initGameData();
		};

		/**
		 * 销毁
		 */
		module.destroy = ()=> {
			util.print("----------game destroy----------");
		};
	}

	return module;
})();