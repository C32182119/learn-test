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
		local.getPosition = (pos, x, y)=> {
			if (pos === 'TOP') {
				return 20 + x * 120;
			}
			if (pos === 'LEFT') {
				return 20 + y * 120;
			}
		};

		/**
		 * 数字的颜色
		 * @param value
		 * @returns {string}
		 */
		local.getNumberColor = (value)=> {
			return value <= 4 ? "#776e65" : "#ffffff";
		};

		/**
		 * 不同数字所在格子的背景颜色
		 * @param value
		 * @returns {string}
		 */
		local.getNumberBgColor = (value)=> {
			switch (value) {
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
					gridCell.css('top', local.getPosition("TOP", i, j));
					gridCell.css('left', local.getPosition("LEFT", i, j));
				}
			}
		};

	}

	/*--------------------模块相关--------------------*/
	{
		/**
		 * 更新前端样式
		 */
		module.updateView = (data)=> {
			//移除现有的样式
			$(".number-cell").remove();

			for (let i = 0; i < global.GRID_SIZE; i++) {
				for (let j = 0; j < global.GRID_SIZE; j++) {
					$("#grid-container").append(
						`<div class="number-cell" id="number-cell-${i}-${j}"></div>`);
					let thisNumberCell = $(`#number-cell-${i}-${j}`);
					//如果格子中没数字，则不显示
					if (data[i][j] === global.CELL_DEFAULT) {
						thisNumberCell.css('width', '0');
						thisNumberCell.css('height', '0');
						thisNumberCell.css('top', local.getPosition("TOP", i, j) + 50);
						thisNumberCell.css('left', local.getPosition("LEFT", i, j) + 50);
					} else {
						thisNumberCell.css('width', '100px');
						thisNumberCell.css('height', '100px');
						thisNumberCell.css('top', local.getPosition("TOP", i, j));
						thisNumberCell.css('left', local.getPosition("LEFT", i, j));
						thisNumberCell.css('background-color', local.getNumberBgColor(data[i][j]));
						thisNumberCell.css('color', local.getNumberColor(data[i][j]));
						thisNumberCell.text(data[i][j]);
					}
				}
			}
		};

		/**
		 * 播放生成数字的动画
		 * @param x
		 * @param y
		 * @param value
		 */
		module.showCreateNumber = (x, y, value)=> {
			let numberCell = $("#number-cell-" + x + "-" + y);
			numberCell.css('background-color', local.getNumberBgColor(value));
			numberCell.css('color', local.getNumberColor(value));
			numberCell.text(value);
			numberCell.animate({
				width: "100px",
				height: "100px",
				top: local.getPosition("TOP", x, y),
				left: local.getPosition("LEFT", x, y)
			}, 100, "linear");
		};

		/**
		 * 播放移动数字的动画
		 * @param fromX
		 * @param fromY
		 * @param toX
		 * @param toY
		 */
		module.showMoveTo = (fromX, fromY, toX, toY)=> {
			let numberCell = $("#number-cell-" + fromX + "-" + fromY);
			numberCell.animate({
				top: local.getPosition("TOP", toX, toY),
				left: local.getPosition("LEFT", toX, toY)
			}, 100, "linear", ()=> {
				module.updateView(game.getGameArray());
			});
		};

		/**
		 * 初始化
		 */
		module.init = ()=> {
			local.initGrid();
		};

	}

	return module;
})();