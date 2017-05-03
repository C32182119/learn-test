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
		dataCache = new Map(),
		currentNode,
		currentDepth = 0,
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

		// counts the number of isolated groups.
		local.islands = function() {
			var self = this;
			var mark = function(x, y, value) {
				if (x >= 0 && x <= 3 && y >= 0 && y <= 3 &&
					self.cells[x][y] &&
					self.cells[x][y].value == value &&
					!self.cells[x][y].marked ) {
					self.cells[x][y].marked = true;

					for (direction in [0,1,2,3]) {
						var vector = self.getVector(direction);
						mark(x + vector.x, y + vector.y, value);
					}
				}
			}

			var islands = 0;

			for (var x=0; x<4; x++) {
				for (var y=0; y<4; y++) {
					if (this.cells[x][y]) {
						this.cells[x][y].marked = false
					}
				}
			}
			for (var x=0; x<4; x++) {
				for (var y=0; y<4; y++) {
					if (this.cells[x][y] &&
						!this.cells[x][y].marked) {
						islands++;
						mark(x, y , this.cells[x][y].value);
					}
				}
			}

			return islands;
		};

		local.smoothness = (data)=> {
			let smoothness = 0;
			for (var x=0; x<4; x++) {
				for (var y=0; y<4; y++) {
					if (data[x][y] !== global.CELL_DEFAULT) {
						let value = Math.log(data[x][y]) / Math.LN2;
						for (let direction of [global.ACTION_RIGHT, global.ACTION_DOWN]) {
							if (direction === global.ACTION_RIGHT) {
								for (let k = y + 1; k < 4; k++) {
									if (data[x][k] !== global.CELL_DEFAULT) {
										let targetValue = Math.log(data[x][k]) / Math.LN2;
										smoothness -= Math.abs(value - targetValue);
										break;
									}
								}
							}
							else if (direction === global.ACTION_DOWN) {
								for (let k = x + 1; k < 4; k++) {
									if (data[k][y] !== global.CELL_DEFAULT) {
										let targetValue = Math.log(data[k][y]) / Math.LN2;
										smoothness -= Math.abs(value - targetValue);
										break;
									}
								}
							}
						}
					}
				}
			}
			return smoothness;
		};

		local.monotonicity = (data)=> {
			let current, next, currentValue, nextValue,
				totals = [0, 0, 0, 0];

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
						totals[0] += nextValue - currentValue;
						//totals[0] += currentValue - nextValue;
					}
					else if (nextValue > currentValue) {
						totals[1] += currentValue - nextValue;
						//totals[1] += nextValue - currentValue;
					}
					current = next;
					next++;
				}
			}

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
						totals[2] += nextValue - currentValue;
						//totals[2] += currentValue - nextValue;
					}
					else if (nextValue > currentValue) {
						totals[3] += currentValue - nextValue;
						//totals[3] += nextValue - currentValue;
					}
					current = next;
					next++;
				}
			}

			return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
		};

		local.evaluation = (data, isPlayerTurn)=> {
			if (isPlayerTurn) {
				//return local.monotonicity(data);
				return local.smoothness(data) * 0.1 +
				local.monotonicity(data) +
					local.maxValue(data) +
					Math.log(local.emptyCell(data)) * 2.7;
			}
			else {
				return -local.smoothness(data);
			}
		};

		local.miniMaxXX = (data, alpha, beta, depth, isPlayerTurn)=> {
			let bestScore, bestMove = -1, result,
				copyData,
				dataMapping;

			//玩家回合(max)
			if (isPlayerTurn) {
				bestScore = alpha;
				for (let direction of [global.ACTION_LEFT, global.ACTION_UP, global.ACTION_RIGHT, global.ACTION_DOWN]) {
					copyData = util.cloneData(data);
					game.moveTo(direction, copyData, false);
					game.resetGameArrayState();
					dataMapping = local.dataMapping(copyData);
					if (!game.isGameOver(copyData)) {
						if (depth === 0) {
							result = { move: bestMove, score: local.evaluation(copyData, isPlayerTurn) };
						}
						else {
							result = local.miniMaxXX(copyData, bestScore, beta, depth - 1, !isPlayerTurn);
						}
						if (bestScore < result.score) {
							bestMove = direction;
							bestScore = result.score;
						}
						if (bestScore > beta) {
							return { move: bestMove, score: beta };
						}

					}
				}
			}
			//电脑回合(min)
			else {
				bestScore = beta;
				let empty = [], res = [], scores = { 2: [], 4: [] }, maxScore;
				//找出所有空的
				for (let i = 0; i < data.length; i++) {
					for (let j = 0; j < data[i].length; j++) {
						if (data[i][j] === global.CELL_DEFAULT) {
							empty.push({i: i, j: j});
						}
					}
				}
				//每一个空的都尝试2或4
				empty.forEach((item, index)=> {
					for (let key in scores) {
						data[item.i][item.j] = key;
						scores[key][index] = local.evaluation(data, isPlayerTurn);
						data[item.i][item.j] = global.CELL_DEFAULT;
					}
				});
				maxScore = Math.max(Math.max(...scores[2]), Math.max(...scores[4]));
				//找出价值最大的
				for (let key in scores) {
					scores[key].forEach((item, index)=> {
						if (item === maxScore) {
							res.push({ pos: empty[index], value: parseInt(key, 10) });
						}
					});
				}
				res.forEach((item)=> {
					copyData = util.cloneData(data);
					copyData[item.pos.i][item.pos.j] = item.value;
					dataMapping = local.dataMapping(copyData);

					result = local.miniMaxXX(copyData, alpha, bestScore, depth, !isPlayerTurn);

					if (bestScore > result.score) {
						bestScore = result.score;
					}
					if (bestScore < alpha) {
						return { move: undefined, score: alpha };
					}

				});

			}

			return { move: bestMove, score: bestScore };
		};

		local.miniMax = (node, depth, isPlayerTurn)=> {
			let alpha = -Infinity, beta = Infinity, bestMove = -1,
				children,
				nodeData = local.dataRevert(node.mapping),
				copyData,
				dataMapping;

			//玩家回合
			if (isPlayerTurn) {
				for (let direction of [global.ACTION_LEFT, global.ACTION_UP, global.ACTION_RIGHT, global.ACTION_DOWN]) {
					copyData = util.cloneData(nodeData);
					game.moveTo(direction, copyData, false);
					game.resetGameArrayState();
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
					local.miniMax(children, depth - 1, !isPlayerTurn);

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
				local.miniMax(children, depth - 1, !isPlayerTurn);

			}

			return bestMove;
		};

		local.iterativeDepth = (data)=> {
			let start = (new Date()).getTime(), depth = 0, bestMove;
			do {
				let newBest = local.miniMaxXX(data, -Infinity, Infinity, depth, true).move;
				if (newBest === -1) {
					break;
				}
				else {
					bestMove = newBest;
				}
				depth++;
			} while ((new Date()).getTime() - start < 1000);

			return bestMove;
		};

	}

	/*--------------------模块相关--------------------*/
	{

		module.getBestMove = (data)=> {
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
			return local.miniMaxXX(data, -Infinity, Infinity, 4, true).move;
		};

		/**
		 * 初始化
		 */
		module.init = ()=> {
			util.log("----------ai init----------");

		};

	}

	return module;
})();