/* globals util, game, animation, ai */
/**
 * 主程序模块
 */
const main = (()=> {
    "use strict";
	/*--------------------初始化成员变量--------------------*/
    let module = {},
	    local = {};

	/*--------------------内部函数--------------------*/
	{
		/**
		 * 初始化
		 */
		local.init = ()=> {
			game.init();
			animation.init();
			ai.init();

		};
	}

    /*--------------------模块相关--------------------*/
	{

		/**
		 * 主程序入口
		 */
		module.start = ()=> {
			util.log("----------main start----------");
			local.init();

			animation.update();
		};

		/**
		 * 销毁
		 */
		module.destroy = ()=> {
			util.log("----------main destroy----------");
			ai.destroy();
			animation.destroy();
			game.destroy();
		};
	}

    return module;
})();