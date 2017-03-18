/* globals util, game */
/**
 * 动画表现模块
 */
const animation = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let module = {},
		local = {};

	/*--------------------辅助函数--------------------*/
	{
		/**
		 * 格子的位置
		 * @param pos
		 * @param x
		 * @param y
		 * @returns {number}
		 */
		local.getPosition = (pos, {x, y})=> {
			if (pos === 'TOP') {
				return 20 + x * 120;
			}
			if (pos === 'LEFT') {
				return 20 + y * 120;
			}
		};

		/**
		 * 数字的颜色
		 * @param number
		 * @returns {string}
		 */
		local.getNumberColor = (number)=> {
			return number <= 4 ? "#776e65" : "#ffffff";
		};

		/**
		 * 不同数字所在格子的背景颜色
		 * @param number
		 * @returns {string}
		 */
		local.getNumberBgColor = (number)=> {
			switch (number) {
				case 2: return "#eee4da";
				case 4: return "#ede0c8";
				case 8: return "#f2b179";
				case 16: return "#f59563";
				case 32: return "#f67e5f";
				case 64: return "#f65e3b";
				case 128: return "#edcf72";
				case 256: return "#edcc61";
				case 512: return "#9c0";
				case 1024: return "#33b5e5";
				case 2048: return "#09c";
				case 4096: return "#a6c";
				case 8192: return "#93c";
			}
			return "#000000";
		};

		/**
		 * 初始化格子的位置
		 */
		local.initGrid = ()=> {
			for (let i = 0; i < global.GRID_SIZE; i++) {
				for (let j = 0; j < global.GRID_SIZE; j++) {
					let gridCell = $(`#grid-cell-${i}-${j}`);
					gridCell.css('top', local.getPosition("TOP", {x: i, y: j}));
					gridCell.css('left', local.getPosition("LEFT", {x: i, y: j}));
				}
			}
		};

		/**
		 * 更新前端样式
		 */
		local.updateView = ()=> {
			//移除现有的样式
			$(".number-cell").remove();

			let data = game.getGameData();
			for (let i = 0; i < global.GRID_SIZE; i++) {
				for (let j = 0; j < global.GRID_SIZE; j++) {
					$("#grid-container").append(
						`<div class="number-cell" id="number-cell-${i}-${j}"></div>`);
					let thisNumberCell = $(`#number-cell-${i}-${j}`);
					//如果格子中没数字，则不显示
					if (data[i][j].value === global.CELL_DEFAULT) {
						thisNumberCell.css('width', '0');
						thisNumberCell.css('height', '0');
						thisNumberCell.css('top', local.getPosition("TOP", {x: i, y: j}) + 50);
						thisNumberCell.css('left', local.getPosition("LEFT", {x: i, y: j}) + 50);
					} else {
						thisNumberCell.css('width', '100px');
						thisNumberCell.css('height', '100px');
						thisNumberCell.css('top', local.getPosition("TOP", {x: i, y: j}));
						thisNumberCell.css('left', local.getPosition("LEFT", {x: i, y: j}));
						thisNumberCell.css('background-color', local.getNumberBgColor(data[i][j].value));
						thisNumberCell.css('color', local.getNumberColor(data[i][j].value));
						thisNumberCell.text(data[i][j].value);
					}
					//还原
					data[i][j].isMerged = false;
				}
			}
		};

	}

	/*--------------------模块相关--------------------*/
	{
		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.log("----------animation init----------");
			local.initGrid();
		};

		/**
		 * 更新
		 */
		module.update = ()=> {
			util.log("----------animation update----------");
			local.updateView();
		};

		/**
		 * 销毁
		 */
		module.destroy = ()=> {
			util.log("----------animation destroy----------");
		};
	}

	return module;
})();