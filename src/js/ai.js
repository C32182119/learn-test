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
		currentNode,
		MAX_DEPTH = 6;

	{

		local.createNode = (mapping, parent)=> {
			parent = (parent === undefined ? null : parent);
			return {
				mapping: mapping,//局面的映射
				value: undefined,//局面的价值
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

		local.emptyCell = (data)=> {
			let count = 0;
			data.forEach((array)=> {
				array.forEach((item)=> {
					if (item === global.CELL_DEFAULT) {
						count++;
					}
				});
			});
			return count;
		};

		local.maxValue = (data)=> {
			let max = -Infinity;
			data.forEach((array)=> {
				max = Math.max(max, ...array);
			});
			return Math.log(max) / Math.LN2;
		};

		local.smoothness = (data)=> {

		};

		local.monotonicity = (data)=> {
			// scores for all four directions
			let current, next, currentValue, nextValue,
				totals = [0, 0, 0, 0];

			// up/down direction
			for (let i = 0; i < global.GRID_SIZE; i++) {
				current = 0;
				next = current + 1;
				while (next < global.GRID_SIZE) {
					while (next < global.GRID_SIZE &&
					data[i][next] === global.CELL_DEFAULT) {
						next++;
					}
					if (next >= global.GRID_SIZE) {
						next--;
					}
					currentValue = data[i][current] !== global.CELL_DEFAULT ?
						Math.log(data[i][current]) / Math.LN2 : 0;
					nextValue = data[i][next] !== global.CELL_DEFAULT ?
						Math.log(data[i][next]) / Math.LN2 : 0;
					if (currentValue > nextValue) {
						// totals[0] += nextValue - currentValue;
						totals[0] += currentValue - nextValue;
					}
					else if (nextValue > currentValue) {
						// totals[1] += currentValue - nextValue;
						totals[1] += nextValue - currentValue;
					}
					current = next;
					next++;
				}
			}

			// left/right direction
			for (let j = 0; j < global.GRID_SIZE; j++) {
				current = 0;
				next = current + 1;
				while (next < global.GRID_SIZE) {
					while ( next < global.GRID_SIZE &&
					data[next][j] === global.CELL_DEFAULT) {
						next++;
					}
					if (next >= global.GRID_SIZE) {
						next--;
					}
					currentValue = data[current][j] !== global.CELL_DEFAULT ?
						Math.log(data[current][j]) / Math.LN2 : 0;
					nextValue = data[next][j] !== global.CELL_DEFAULT ?
						Math.log(data[next][j]) / Math.LN2 : 0;
					if (currentValue > nextValue) {
						// totals[2] += nextValue - currentValue;
						totals[2] += currentValue - nextValue;
					}
					else if (nextValue > currentValue) {
						// totals[3] += currentValue - nextValue;
						totals[3] += nextValue - currentValue;
					}
					current = next;
					next++;
				}
			}

			return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
		};

		local.evaluation = (data)=> {
			return local.monotonicity(data);
			// return local.monotonicity(data) +
			// 	local.maxValue(data) +
			// 	Math.log(local.emptyCell(data)) * 2.7;
		};

		local.miniMax = (node, depth, isPlayerTurn)=> {
			let alpha = -Infinity, beta = Infinity, bestMove = -1,
				children,
				nodeData = local.dataRevert(node.mapping),
				copyData,
				dataMapping;

			if (depth === MAX_DEPTH) {
				let randomMove = [global.ACTION_LEFT, global.ACTION_UP,
					global.ACTION_RIGHT, global.ACTION_DOWN];
				// bestMove = randomMove[Math.floor(Math.random() * randomMove.length)];
				return bestMove;
			}
			//玩家回合
			if (isPlayerTurn) {
				for (let direction of [global.ACTION_LEFT, global.ACTION_UP, global.ACTION_RIGHT, global.ACTION_DOWN]) {
					copyData = util.cloneData(nodeData);
					game.moveTo(direction, copyData, false);
					dataMapping = local.dataMapping(copyData);
					//该操作没有改变局面
					if (dataMapping === node.mapping) {
						children = local.createNode(dataMapping, node);
					}
					else {
						//该局面已经搜索过
						if (searchTree.has(dataMapping)) {
							children = searchTree.get(dataMapping);
						}
						else {
							children = local.createNode(dataMapping, node);
							searchTree.set(dataMapping, children);
						}
					}
					node.children.push(children);
					if (!game.isGameOver(copyData)) {
						if (children.value !== undefined) {
							alpha = children.value;
						}
						else {
							alpha = local.evaluation(copyData);
							children.value = alpha;
						}
					}

					children.alpha = Math.max(children.alpha, alpha);
					if (node.alpha < children.alpha) {
						bestMove = direction;
						node.alpha = children.alpha;
					}
					//是否剪枝
					// if (children.alpha < children.beta) {
					// 	local.miniMax(children, depth + 1, !isPlayerTurn);
					// }

					//todo
					local.miniMax(children, depth + 1, !isPlayerTurn);

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
				// if (children.alpha < children.beta) {
				// 	local.miniMax(children, depth + 1, !isPlayerTurn);
				// }

				//todo
				local.miniMax(children, depth + 1, !isPlayerTurn);

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
				node = local.createNode(dataMapping, currentNode);
				searchTree.set(dataMapping, node);
			}
			currentNode = node;
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