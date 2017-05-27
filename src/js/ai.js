/* globals util, game */
/**
 * AI模块
 */
const ai = (()=> {
	"use strict";
	/*--------------------初始化成员变量--------------------*/
	let local = {}, module = {},
		TT;//置换表
	let	cutOff = 0, cacheTimes = 0;

	{

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

		local.evaluation = (data, isPlayTurn)=> {
			let result = 0, totals = [0, 0, 0, 0],
				evaluation = { empty: 0, max: 0, smooth: 0, monotonicity: 0,  isolation: 0 },
				weights = (function (isPlayTurn) {
					let empty        = isPlayTurn ? 2.7 : 1.0,
						max          = isPlayTurn ? 1.0 : 1.0,
						smooth       = isPlayTurn ? -0.1 : 1.0,
						monotonicity = isPlayTurn ? -1.0 : 1.0,
						isolation    = isPlayTurn ? 0 : 1.0;
					return { empty: empty, max: max, smooth: smooth, monotonicity: monotonicity, isolation: isolation };
				})(isPlayTurn);
			for (let i = 0; i < global.GAME_GRID_SIZE; i++) {
				// if (isPlayTurn) {
					//最大值
					evaluation.max = Math.max(evaluation.max, ...data[i]);
				// }
				for (let j = 0; j < global.GAME_GRID_SIZE; j++) {
					// if (isPlayTurn) {
						//空格数
						if (data[i][j] === global.GAME_CELL_DEFAULT) {
							evaluation.empty++;
						}
					// }
					//平滑性
					let value, targetValue;
					if (data[i][j] !== global.GAME_CELL_DEFAULT) {
						value = Math.log(data[i][j]) / Math.LN2;
						for (let direction of [global.GAME_ACTION_RIGHT, global.GAME_ACTION_DOWN]) {
							if (direction === global.GAME_ACTION_RIGHT) {
								for (let k = j + 1; k < global.GAME_GRID_SIZE; k++) {
									if (data[i][k] !== global.GAME_CELL_DEFAULT) {
										targetValue = Math.log(data[i][k]) / Math.LN2;
										evaluation.smooth += Math.abs(value - targetValue);
										break;
									}
								}
							}
							else if (direction === global.GAME_ACTION_DOWN) {
								for (let k = i + 1; k < global.GAME_GRID_SIZE; k++) {
									if (data[k][j] !== global.GAME_CELL_DEFAULT) {
										targetValue = Math.log(data[k][j]) / Math.LN2;
										evaluation.smooth += Math.abs(value - targetValue);
										break;
									}
								}
							}
						}
					}
				}
				// if (isPlayTurn) {
					//单调性
					let current = 0, next = 1, currentValue, nextValue;
					//左右方向
					while (next < global.GAME_GRID_SIZE) {
						while (next < global.GAME_GRID_SIZE && data[i][next] === global.GAME_CELL_DEFAULT) {
							next++;
						}
						if (next >= global.GAME_GRID_SIZE) {
							next--;
						}
						currentValue = data[i][current] !== global.GAME_CELL_DEFAULT ?
							Math.log(data[i][current]) / Math.LN2 : 0;
						nextValue = data[i][next] !== global.GAME_CELL_DEFAULT ?
							Math.log(data[i][next]) / Math.LN2 : 0;
						if (currentValue > nextValue) {
							totals[0] += currentValue - nextValue;
						}
						else if (nextValue > currentValue) {
							totals[1] += nextValue - currentValue;
						}
						current = next;
						next++;
					}
					//上下方向
					current = 0;
					next = 1;
					while (next < global.GAME_GRID_SIZE) {
						while (next < global.GAME_GRID_SIZE && data[next][i] === global.GAME_CELL_DEFAULT) {
							next++;
						}
						if (next >= global.GAME_GRID_SIZE) {
							next--;
						}
						currentValue = data[current][i] !== global.GAME_CELL_DEFAULT ?
							Math.log(data[current][i]) / Math.LN2 : 0;
						nextValue = data[next][i] !== global.GAME_CELL_DEFAULT ?
							Math.log(data[next][i]) / Math.LN2 : 0;
						if (currentValue > nextValue) {
							totals[2] += currentValue - nextValue;
						}
						else if (nextValue > currentValue) {
							totals[3] += nextValue - currentValue;
						}
						current = next;
						next++;
					}
				// }
			}
			// if (!isPlayTurn) {
			// 	let marked = [],
			// 		mark = (x, y, value)=> {
			// 			if (x >= 0 && x <= 3 && y >= 0 && y <= 3 &&
			// 				data[x][y] !== global.GAME_CELL_DEFAULT &&
			// 				data[x][y] === value && !marked[x][y]) {
			// 				marked[x][y] = true;
			// 				for (let direction of [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }]) {
			// 					mark(x + direction.x, y + direction.y, value);
			// 				}
			// 			}
			// 		};
			// 	for (let x = 0; x < 4; x++) {
			// 		marked[x] = [];
			// 		for (let y = 0; y < 4; y++) {
			// 			if (data[x][y] !== global.GAME_CELL_DEFAULT) {
			// 				marked[x][y] = false;
			// 			}
			// 		}
			// 	}
			// 	for (let x = 0; x < 4; x++) {
			// 		for (let y = 0; y < 4; y++) {
			// 			if (data[x][y] !== global.GAME_CELL_DEFAULT && !marked[x][y]) {
			// 				evaluation.isolation++;
			// 				mark(x, y, data[x][y]);
			// 			}
			// 		}
			// 	}
			// }

			// if (evaluation.empty > 7) {
			// 	evaluation.empty = Math.log(evaluation.empty);
			// }
			// else {
			// 	evaluation.empty *= 10;
			// }
			// if (isPlayTurn) {
				evaluation.empty = Math.log(evaluation.empty);
				evaluation.max = Math.log(evaluation.max) / Math.LN2;
				evaluation.monotonicity = Math.min(totals[0], totals[1]) + Math.min(totals[2], totals[3]);
			// }
			for (let key in evaluation) {
				result += evaluation[key] * weights[key];
			}
			return result;
		};

		local.translationTable = ()=> {
			let loc = {}, mod = {},
				t = new Map();
			mod.t = t;

			loc.get = (key)=> {
				return t.get(key);
			};

			loc.set = (key, value)=> {
				t.set(key, value);
			};

			mod.has = (key) => {
				return t.has(key);
			};

			mod.getValue = (key)=> {
				if (!mod.has(key)) {
					return;
				}
				let data = loc.get(key);
				return data;
			};

			mod.replace = (key, value, depth)=> {
				if (!mod.has(key)) {
					loc.set(key, value);
					return;
				}
				let data = loc.get(key);
				if (data.depth > depth) {
					return;
				}
				// if (data.depth === depth) {
				// 	if (data.type === "EXACT" && data.value > value.value) {
				// 		return;
				// 	}
				// 	if (data.type === "LOW" && data.value < value.value) {
				// 		return;
				// 	}
				// 	if (data.type === "HIGH" && data.value > value.value) {
				// 		return;
				// 	}
				// }
				loc.set(key, value);
			};

			return mod;
		};

		local.miniMax = (data, alpha, beta, depth, isPlayerTurn)=> {
			let move = -1, score, result, copyData, dataMapping, ttVal,
				thisMap = local.dataMapping(data);

			//玩家回合(max)
			if (isPlayerTurn) {
				score = alpha;
				let nodeType = "LOW", candidates = [],
					moveDirection = [ global.GAME_ACTION_LEFT, global.GAME_ACTION_UP,
						global.GAME_ACTION_RIGHT, global.GAME_ACTION_DOWN ];
				if (TT.has(thisMap)) {
					ttVal = TT.getValue(thisMap);
					if (ttVal.depth > depth) {
						cacheTimes++;
						if (ttVal.type === "EXACT") {
							return { move: ttVal.move, score: ttVal.value };
						}
						if (ttVal.type === "LOW" && ttVal.value < alpha) {
							// return { move: ttVal.move, score: alpha };
						}
						if (ttVal.type === "HIGH" && ttVal.value > beta) {
							return { move: ttVal.move, score: beta };
						}
					}
				}
				if (ttVal !== undefined && ttVal.move !== -1) {
					candidates.push(ttVal.move);
					moveDirection = moveDirection.filter((item)=> {
						return item !== ttVal.move;
					});
				}
				for (let direction of moveDirection) {
					if (game.isMovable(direction, data)) {
						candidates.push(direction);
					}
				}
				for (let direction of candidates) {
					copyData = util.cloneData(data);
					game.moveTo(direction, copyData, false);
					dataMapping = local.dataMapping(copyData);
					if (!game.isGameOver(copyData)) {
						// if (game.getMaxNumber(copyData) >= global.GAME_CELL_MAX) {
						// 	global.GAME_CELL_MAX *= 2;
						// 	return { move: move, score: 10000 };
						// }
						if (depth === 0) {
							result = { move: move, score: local.evaluation(copyData, isPlayerTurn) };
							TT.replace(thisMap, { depth: depth, value: result.score, type: "EXACT", move: move }, depth);
						}
						else {
							result = local.miniMax(copyData, score, beta, depth - 1, !isPlayerTurn);
						}

						// if (result.score > beta) {
						// 	cutOff++;
						// 	TT.replace(thisMap, { depth: depth, value: beta, type: "HIGH", move: -1 }, depth);
						// 	return { move: -1, score: beta };
						// }
						// if (result.score > alpha) {
						// 	move = direction;
						// 	alpha = result.score;
						// 	nodeType = "EXACT";
						// }

						if (score < result.score) {
							move = direction;
							score = result.score;
							nodeType = "EXACT";
						}
						if (score > beta) {
							cutOff++;
							TT.replace(thisMap, { depth: depth, value: beta, type: "HIGH", move: move }, depth);
							return { move: move, score: beta };
						}

					}
				}
				TT.replace(thisMap, { depth: depth, value: score, type: nodeType, move: move }, depth);
			}
			//电脑回合(min)
			else {
				score = beta;
				let empty = [], res = [], scores = { 2: [], 4: [] }, maxScore;
				//找出所有空的
				for (let i = 0; i < data.length; i++) {
					for (let j = 0; j < data[i].length; j++) {
						if (data[i][j] === global.GAME_CELL_DEFAULT) {
							empty.push({ x: i, y: j });
						}
					}
				}
				//每一个空的都尝试2或4
				empty.forEach((item, index)=> {
					for (let key in scores) {
						data[item.x][item.y] = key;
						scores[key][index] = local.evaluation(data, isPlayerTurn);
						data[item.x][item.y] = global.GAME_CELL_DEFAULT;
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
				for (let i = 0; i < res.length; i++) {
					copyData = util.cloneData(data);
					copyData[res[i].pos.x][res[i].pos.y] = res[i].value;
					dataMapping = local.dataMapping(copyData);
					result = local.miniMax(copyData, alpha, score, depth, !isPlayerTurn);
					if (score > result.score) {
						score = result.score;
					}
					if (score < alpha) {
						cutOff++;
						return { move: -1, score: alpha };
					}
				}
			}

			return { move: move, score: score };
		};

		local.iterativeDeepening = (data)=> {
			let result, start = (new Date()).getTime(), end,
				depth = 1, bestMove = -1, bestScore = -Infinity,
				dataMapping = local.dataMapping(data);
			do {
				cutOff = 0;
				let alpha = -Infinity, beta = Infinity;
				if (TT.has(dataMapping)) {
					let val = TT.getValue(dataMapping);
					if (val.type === "LOW") {
						// alpha = val.value;

						// beta = val.value;
					}
					if (val.type === "HIGH") {
						// beta = val.value;

						// alpha = val.value;
					}
				}
				result = local.miniMax(data, bestScore, beta, depth, true);
				if (result.move === -1) {
					break;
				}
				else {
					bestMove = result.move;
					// bestScore = result.score;
					if (depth < 3) {
						// bestScore = result.score;
					}
					else {
						// bestScore = -Infinity;
					}
				}
				depth++;
				end = (new Date()).getTime();
			} while (end - start < global.AI_MAX_TIME);
			util.log("time: ", end - start, "cutOff: ", cutOff, "depth: ", depth, "cacheTimes: ", cacheTimes);
			return bestMove;
		};

	}

	/*--------------------模块相关--------------------*/
	{

		module.getBestMove = (data)=> {
			let move = local.iterativeDeepening(data);
			if (move === -1) {
				for (let direction of [global.GAME_ACTION_LEFT, global.GAME_ACTION_UP, global.GAME_ACTION_RIGHT, global.GAME_ACTION_DOWN]) {
					if (game.isMovable(direction)) {
						move = direction;
						break;
					}
				}
			}
			return move;
		};

		/**
		 * 初始化
		 */
		module.init = ()=> {
			TT = local.translationTable();
			module.TT = TT;
		};

	}

	return module;
})();