/* globals util */
/**
 * AI模块
 */
const ai = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let module = {};

	/*--------------------模块相关--------------------*/
	{
		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.print("----------ai init----------");
		};

		/**
		 * 销毁
		 */
		module.destroy = ()=> {
			util.print("----------ai destroy----------");
		};
	}

	return module;
})();