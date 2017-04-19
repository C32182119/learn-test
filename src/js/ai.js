/* globals util, game */
/**
 * AI模块
 */
const ai = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let local = {},
		module = {},
		searchTree = new Map(),
		dataMap = new Map(),
		MAX_DEPTH = 6;

	{
		local.getMax = (array)=> {
			let max = -Infinity;
			array.forEach((node)=> {
				max = Math.max(max, node.value);
			});
			return max;
		};

		local.createNode = (mapping, parent)=> {
			parent = (parent === undefined ? null : parent);
			return {
				mapping: mapping,//局面的映射
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

		local.dataRevert = (mapping)=> {
			let result = [];
			mapping.split(" ").forEach((row, i)=> {
				result[i] = [];
				row.split(",").forEach((col, j)=> {
					result[i][j] = parseInt(col, 10);
				});
			});
			return result;
		};

		local.evaluation = (data)=> {
			return Math.random()+searchTree.size*0.1;
		};

		local.miniMax = (node, depth, isPlayerTurn)=> {
			if (depth === MAX_DEPTH) {
				return -1;
			}
			let alpha = -Infinity,
				beta = Infinity,
				bestMove = -1,
				children,
				nodeData = local.dataRevert(node.mapping),
				copyData,
				dataMapping;
			//玩家回合
			if (isPlayerTurn) {
				for (let direction of [global.ACTION_LEFT, global.ACTION_UP, global.ACTION_RIGHT, global.ACTION_DOWN]) {
					copyData = util.cloneData(nodeData);
					game.moveTo(direction, copyData, false);
					dataMapping = local.dataMapping(copyData);
					if (searchTree.has(dataMapping)) {
						children = searchTree.get(dataMapping);
					}
					else {
						children = local.createNode(dataMapping, node);
						searchTree.set(dataMapping, children);
					}
					node.children.push(children);
					if (!game.isGameOver(copyData)) {
						alpha = local.evaluation(copyData);
					}
					children.alpha = Math.max(children.alpha, alpha);
					if (node.alpha < children.alpha) {
						bestMove = direction;
						node.alpha = children.alpha;
					}
					//是否剪枝
					if (children.alpha < children.beta) {
						local.miniMax(children, depth + 1, !isPlayerTurn);
					}

				}
			}
			//电脑回合
			else {
				let empty = [], res = {}, val;
				copyData = util.cloneData(nodeData);
				//找出所有空的
				for (let i = 0; i < copyData.length; i++) {
					for (let j = 0; j < copyData[i].length; j++) {
						if (copyData[i][j] === global.CELL_DEFAULT) {
							empty.push({i: i, j: j});
						}
					}
				}
				//每一个空的都尝试2或4
				empty.forEach((item)=> {
					for (let value of [2, 4]) {
						copyData[item.i][item.j] = value;
						val = local.evaluation(copyData);
						if (val < beta) {
							beta = val;
							res.data = item;
							res.value = value;
						}
						copyData[item.i][item.j] = global.CELL_DEFAULT;
					}
				});

				copyData[res.data.i][res.data.j] = res.value;
				dataMapping = local.dataMapping(copyData);
				if (searchTree.has(dataMapping)) {
					children = searchTree.get(dataMapping);
				}
				else {
					children = local.createNode(dataMapping, node);
					searchTree.set(dataMapping, children);
				}
				node.children.push(children);
				children.beta = Math.min(children.beta, beta);
				node.beta = Math.min(node.beta, children.beta);
				//是否剪枝
				if (children.alpha < children.beta) {
					local.miniMax(children, depth + 1, isPlayerTurn);
				}
			}

			return bestMove;
		};

		local.iterativeDepth = ()=> {




		};


	}

	/*--------------------模块相关--------------------*/
	{
		module.func = (data)=> {
			let root = local.createNode();


		};

		module.getBestMove = (data, isPlayTurn)=> {
			let node, dataMapping;
			dataMapping = local.dataMapping(data);
			if (searchTree.has(dataMapping)) {
				node = searchTree.get(dataMapping);
			}
			else {
				node = local.createNode(dataMapping);
				searchTree.set(dataMapping, node);
			}
			//todo
			return local.miniMax(node, 0, isPlayTurn);
		};

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