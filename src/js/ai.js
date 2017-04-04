/* globals util, game */
/**
 * AI模块
 */
const ai = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let local = {},
		module = {},
		searchCache = {};

	{
		local.createNode = ()=> {
			return {
				parent: undefined,
				value: 0,
				alpha: -Infinity,
				beta: Infinity
			};
		};

		local.dataMapping = (data)=> {
			return data.join(" ");
		};

		local.evaluation = ()=> {

		};

		local.miniMax = (data, depth)=> {

			for (let direction in [global.ACTION_LEFT, global.ACTION_UP, global.ACTION_RIGHT, global.ACTION_DOWN]) {
				


			}

		};




	}

	/*--------------------模块相关--------------------*/
	{
		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.log("----------ai init----------");
		};

		/**
		 * 销毁
		 */
		module.destroy = ()=> {
			util.log("----------ai destroy----------");
		};
	}

	return module;
})();