/*--------------------全局参数--------------------*/
const global = {//jshint ignore: line
	"GAME_CELL_MAX": 2048,//最大目标数字
	"GAME_CELL_DEFAULT": 0,//初始化的数字
	"GAME_GRID_SIZE": 4,//网格的大小，4X4
	"GAME_ACTION_LEFT": 1,//左
	"GAME_ACTION_UP": 2,//上
	"GAME_ACTION_RIGHT": 3,//右
	"GAME_ACTION_DOWN": 4,//下
	"GAME_ACTION_ALL": 5,//任意方向
	"AI_MAX_TIME": 120,//ai搜索深度(单位: ms)
	"WORKER_MAX_THREAD": 3//worker最大数
};
/**
 * 全局模块
 */
const util = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let module = {};

	/*--------------------模块相关--------------------*/
	{
		/**
		 * 判断一个对象是否为空
		 * @param object
		 * @returns {boolean}
		 */
		module.isEmptyObject = (object)=> {
			for (let key in object) {
				if (object.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		};

		/**
		 * clone一个二维数组
		 * @param data
		 * @returns {Array}
		 */
		module.cloneData = (data)=> {
			let result = [];
			data.forEach((array)=> {
				let items = [];
				array.forEach((item)=> {
					items.push(item);
				});
				result.push(items);
			});
			return result;
		};

		/**
		 * clone一个对象
		 * @param obj
		 * @returns {*}
		 */
		module.clone = (obj)=> {
			let result;
			switch (typeof obj) {
				case "number": case "string": case "boolean": result = obj; break;
				case "object":
					let o = {};
					for (let key in obj) {
						o[key] = module.clone(obj[key]);
					}
					result = o;
					break;
				default:
					result = obj;
			}
			return result;
		};

		/**
		 * 打印信息
		 */
		module.log = function () {
			let args = Array.prototype.slice.call(arguments);
			args.forEach((value)=> {
				console.log(value);
			});
		};
	}

	return module;
})();