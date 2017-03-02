// 存放游戏数据的二维数组
var board = new Array();
// 防止出现连续合并
var isConflicted = new Array();
// 分数
var score = 0;
// 胜利条件 maxNumber = 2048
var maxNumber = 0;

$(document).ready(function() {
    newGame();
});

function newGame() {

    init();

    generateOneNumber();
    generateOneNumber();

}

// 初始化函数
function init() {

    score = 0;
    maxNumber = 0;

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        isConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            isConflicted[i][j] = false;
        }
    }

    updateBoardView();
    updateScore(score);

}

// 更新前端样式
function updateBoardView() {

    // 移除现有的样式
    $(".number-cell").remove();

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append(
                '<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>'
            );
            var thisNumberCell = $("#number-cell-" + i + "-" + j);

            // 如果格子中没数字，则不显示
            if (board[i][j] == 0) {
                thisNumberCell.css('width', '0');
                thisNumberCell.css('height', '0');
                thisNumberCell.css('top', getPosTop(i, j) + 50);
                thisNumberCell.css('left', getPosLeft(i, j) + 50);
            } else {
                thisNumberCell.css('width', '100px');
                thisNumberCell.css('height', '100px');
                thisNumberCell.css('top', getPosTop(i, j));
                thisNumberCell.css('left', getPosLeft(i, j));
                thisNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                thisNumberCell.css('color', getNumberColor(board[i][j]));
                thisNumberCell.text(board[i][j]);
            }

            // 还原
            isConflicted[i][j] = false;
        }
    }

}

// 随机生成一个数字
function generateOneNumber() {

    // 若当前格子已经被占满
    if (!isEmpty(board)) { return false; }

    //随机一个位置
    var tempObj = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                tempObj.push(i + "," + j);
            }
        }
    }
    var randn = parseInt(Math.floor(Math.random() * tempObj.length));
    var randx = parseInt(tempObj[randn].split(",")[0]);
    var randy = parseInt(tempObj[randn].split(",")[1]);

    //随机一个数字
    var randNumber = Math.random() < 0.9 ? 2 : 4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;

}

// 响应键盘事件
$(document).keydown(function(event) {
    event.preventDefault();
    switch (event.keyCode) {
        //left & A
        case 37:
        case 65:
            {
                if (moveLeft()) {
                    setTimeout("generateOneNumber()", 250);

                }
                isGameOver();
                break;
            }
            //up & W
        case 38:
        case 87:
            {
                if (moveUp()) {
                    setTimeout("generateOneNumber()", 250);

                }
                isGameOver();
                break;
            }
            //right & D
        case 39:
        case 68:
            {
                if (moveRight()) {
                    setTimeout("generateOneNumber()", 250);

                }
                isGameOver();
                break;
            }
            //down & S
        case 40:
        case 83:
            {
                if (moveDown()) {
                    setTimeout("generateOneNumber()", 250);

                }
                isGameOver();
                break;
            }
        default:
            break;
    }
});

// 游戏是否结束
function isGameOver() {

    if (maxNumber == 2048) {
        setTimeout("gameWin()", 300);
        return true;
    }

    if (!isEmpty(board) && !isMove(board)) {
        setTimeout("gameOver()", 300);
        return true;
    }
    return false;

}

// 游戏获胜
function gameWin() {

    if (confirm('You Win!\n是否继续？')) {
        maxNumber = 2049;
    } else {
        newGame();
    }

}

// 游戏失败
function gameOver() {

    alert('Game Over!');

}

function moveLeft() {

    if (!canMoveLeft(board)) {
        if (isEmpty) { return true; }
        return false;
    }

    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && !isBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] &&
                        !isBlockHorizontal(i, k, j, board) &&
                        !isConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        isConflicted[i][k] = true;
                        updateMaxNumber(board[i][k]);
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;

}

function moveUp() {

    if (!canMoveUp(board)) {
        if (isEmpty) { return true; }
        return false;
    }

    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && !isBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] &&
                        !isBlockVertical(j, k, i, board) &&
                        !isConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        isConflicted[k][j] = true;
                        updateMaxNumber(board[k][j]);
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;

}

function moveRight() {

    if (!canMoveRight(board)) {
        if (isEmpty) { return true; }
        return false;
    }

    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && !isBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] &&
                        !isBlockHorizontal(i, j, k, board) &&
                        !isConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        isConflicted[i][k] = true;
                        updateMaxNumber(board[i][k]);
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;

}

function moveDown() {

    if (!canMoveDown(board)) {
        if (isEmpty) { return true; }
        return false;
    }

    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && !isBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] &&
                        !isBlockVertical(j, i, k, board) &&
                        !isConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        isConflicted[k][j] = true;
                        updateMaxNumber(board[k][j]);
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;

}

function updateMaxNumber(number) {

    maxNumber = maxNumber > number ? maxNumber : number;

}

function autoPlay() {

    var time = 0;
    var gameTimer = setInterval('autoMove()', 100);
    if (isGameOver()) {
        clearInterval(this.gameTimer);
    }
}

function autoMove() {

    var direction = AI(board);
    switch (direction) {
        case 0:
            // alert("Move Left");
            if (moveLeft()) { setTimeout("generateOneNumber()", 250); }
            break;
        case 1:
            // alert("Move Up");
            if (moveUp()) { setTimeout("generateOneNumber()", 250); }
            break;
        case 2:
            // alert("Move Right");
            if (moveRight()) { setTimeout("generateOneNumber()", 250); }
            break;
        case 3:
            // alert("Move Down");
            if (moveDown()) { setTimeout("generateOneNumber()", 250); }
            break;
        default:
            break;
    }

}