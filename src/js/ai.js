/* globals util, game */
/**
 * AI模块
 */
const ai = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let local = {},
		module = {},
		searchTree = {},
		dataMap = {},
		MAX_DEPTH = 6;

	{
		local.getMax = (array)=> {
			let max = -Infinity;
			array.forEach((node)=> {
				max = Math.max(max, node.value);
			});
			return max;
		};

		local.createNode = (data, parent)=> {
			parent = (parent === undefined ? null : parent);
			return {
				mapping: local.dataMapping(data),//局面的映射
				value: 0,//局面的价值
				parent: parent,//父节点
				children: [],//子节点
				alpha: (parent === null ? -Infinity : parent.alpha),
				beta: (parent === null ? Infinity : parent.beta)
			};
		};

		local.dataMapping = (data)=> {
			return data.join(" ");
		};

		local.evaluation = (data)=> {

		};

		local.miniMax = (parent, depth, isPlayerTurn)=> {
			if (depth === MAX_DEPTH) {
				return;
			}
			let alpha = -Infinity,
				beta = Infinity,
				bestMove = -1,
				bestValue,
				result;
			let node,
				copyData = util.cloneData(dataMap[parent.mapping]);
			//玩家回合
			if (isPlayerTurn) {
				for (let direction in [global.ACTION_LEFT, global.ACTION_UP, global.ACTION_RIGHT, global.ACTION_DOWN]) {

					game.moveTo(direction, copyData, false);

					node = local.createNode(copyData, parent);
					parent.children.push(node);
					if (!game.isGameOver(copyData)) {
						alpha = local.evaluation(copyData);
					}
					node.alpha = Math.max(node.alpha, alpha);
					if (parent.alpha < node.alpha) {
						bestMove = direction;
						parent.alpha = node.alpha;
					}
					//是否剪枝
					if (node.alpha < node.beta) {
						local.miniMax(copyData, depth + 1, !isPlayerTurn);
					}
				}
			}
			//电脑回合
			else {
				let empty = [], res = {}, val;
				//找出所有空的
				copyData.forEach((array)=> {
					array.forEach((item)=> {
						if (item.value === global.CELL_DEFAULT) {
							empty.push(item);
						}
					});
				});
				//每一个空的都尝试2或4
				empty.forEach((item)=> {
					for (let value in [2, 4]) {
						item.value = value;
						val = local.evaluation(copyData);
						if (val < beta) {
							beta = val;
							res.data = item;
							res.value = value;
						}
						item.value = global.CELL_DEFAULT;
					}
				});

				res.data.value = res.value;
				node = local.createNode(copyData, parent);
				parent.children.push(node);
				node.beta = Math.min(node.beta, beta);
				parent.beta = Math.min(parent.beta, node.beta);
				//是否剪枝
				if (node.alpha < node.beta) {
					local.miniMax(copyData, depth + 1, isPlayerTurn);
				}
			}
			return bestMove;
		};

		local.func = ()=> {




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