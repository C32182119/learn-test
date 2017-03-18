/*--------------------全局参数--------------------*/
const global = {//jshint ignore: line
	"CELL_MAX": 2048,//允许出现的最大数字
	"CELL_DEFAULT": 0,//初始化的数字
	"GRID_SIZE": 4//网格的大小，4X4
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