/*--------------------全局参数--------------------*/
const global = {//jshint ignore: line
	"CELL_MAX": 2048,//允许出现的最大数字
	"CELL_DEFAULT": 0,//初始化的数字
	"GRID_SIZE": 4,//网格的大小，4X4
	"ACTION_LEFT": 1,//左
	"ACTION_UP": 2,//上
	"ACTION_RIGHT": 3,//右
	"ACTION_DOWN": 4,//下
	"ACTION_ALL": 5//任意方向
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